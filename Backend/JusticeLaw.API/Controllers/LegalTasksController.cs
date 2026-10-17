using JusticeLaw.API.Data;
using JusticeLaw.API.Models;
using JusticeLaw.API.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace JusticeLaw.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LegalTasksController : ControllerBase
    {
        private readonly LawDBContext dbContext;

        public LegalTasksController(LawDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Tasks the current user is allowed to see, based on the case they belong to:
        //   Admin    -> all tasks
        //   Client   -> tasks on their own cases
        //   Attorney -> tasks on cases assigned to them
        //   anyone else -> nothing
        private IQueryable<LegalTask> VisibleTasks()
        {
            var tasks = dbContext.LegalTasks.AsQueryable();

            if (User.IsInRole("Admin"))
                return tasks;

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return tasks.Where(t => false);

            if (User.IsInRole("Client"))
            {
                var myCaseIds = dbContext.Cases
                    .Where(c => c.Client != null && c.Client.UserId == userId)
                    .Select(c => c.Id);
                return tasks.Where(t => myCaseIds.Contains(t.CaseId));
            }

            if (User.IsInRole("Attorney"))
            {
                var myCaseIds = dbContext.Cases
                    .Where(c => c.Attorney != null && c.Attorney.UserId == userId)
                    .Select(c => c.Id);
                return tasks.Where(t => myCaseIds.Contains(t.CaseId));
            }

            return tasks.Where(t => false);
        }

        // Admin can manage any task. An Attorney can only manage tasks on cases assigned to them.
        private bool CanManageCase(Guid? caseId)
        {
            if (User.IsInRole("Admin")) return true;
            if (!User.IsInRole("Attorney") || caseId == null) return false;

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return false;

            return dbContext.Cases.Any(c => c.Id == caseId && c.Attorney != null && c.Attorney.UserId == userId);
        }

        [HttpGet]
        public IActionResult GetAllTasks()
        {
            return Ok(VisibleTasks().ToList());
        }

        [Authorize(Roles = "Admin,Attorney")]
        [HttpPost]
        public IActionResult AddTask(AddTaskDto addTaskDto)
        {
            if (!CanManageCase(addTaskDto.CaseId))
                return StatusCode(StatusCodes.Status403Forbidden);

            var taskEntity = new LegalTask()
            {
                TaskName = addTaskDto.TaskName,
                Description = addTaskDto.Description,
                DueDate = addTaskDto.DueDate,
                Status = addTaskDto.Status,
                CaseId = addTaskDto.CaseId
            };

            dbContext.LegalTasks.Add(taskEntity);
            dbContext.SaveChanges();

            return Ok(taskEntity);
        }

        // GET: api/LegalTasks/{id}
        // Someone else's task returns 404, so its existence isn't revealed.
        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetTask(Guid id)
        {
            var task = VisibleTasks().FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [Authorize(Roles = "Admin,Attorney")]
        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateTask(Guid id, UpdateTaskDto updateTaskDto)
        {
            var task = VisibleTasks().FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();

            // The new case must exist
            if (updateTaskDto.CaseId == Guid.Empty || !dbContext.Cases.Any(c => c.Id == updateTaskDto.CaseId))
                return BadRequest("Case not found.");

            // An attorney must own BOTH the task's current case and the case it is being moved to
            if (!CanManageCase(task.CaseId) || !CanManageCase(updateTaskDto.CaseId))
                return StatusCode(StatusCodes.Status403Forbidden, "You can only manage tasks on your own cases.");

            task.TaskName = updateTaskDto.TaskName;
            task.Description = updateTaskDto.Description;
            task.DueDate = updateTaskDto.DueDate;
            task.Status = updateTaskDto.Status;
            task.CaseId = updateTaskDto.CaseId;   // <-- the missing line

            dbContext.SaveChanges();
            return Ok(task);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteTask(Guid id)
        {
            var task = dbContext.LegalTasks.Find(id);
            if (task == null) return NotFound();

            dbContext.LegalTasks.Remove(task);
            dbContext.SaveChanges();
            return Ok(task);
        }

        // GET: api/LegalTasks/case/{caseId}
        // For Attorney & Client dashboards: tasks for one case.
        // If the case isn't theirs, the list comes back empty.
        [HttpGet]
        [Route("case/{caseId:guid}")]
        public IActionResult GetTasksByCase(Guid caseId)
        {
            var tasks = VisibleTasks()
                .Where(t => t.CaseId == caseId)
                .ToList();

            return Ok(tasks);
        }
    }
}
