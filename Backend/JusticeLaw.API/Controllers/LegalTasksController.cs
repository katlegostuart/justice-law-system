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

        [HttpGet]
        public IActionResult GetAllTasks()
        {
            return Ok(dbContext.LegalTasks.ToList());
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult AddTask(AddTaskDto addTaskDto)
        {
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

        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetTask(Guid id)
        {
            var task = dbContext.LegalTasks.Find(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateTask(Guid id, UpdateTaskDto updateTaskDto)
        {
            var task = dbContext.LegalTasks.Find(id);
            if (task == null) return NotFound();

            task.TaskName = updateTaskDto.TaskName;
            task.Description = updateTaskDto.Description;
            task.DueDate = updateTaskDto.DueDate;
            task.Status = updateTaskDto.Status;

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
        // Crucial for Attorney & Client dashboards to get tasks for a specific case
        [HttpGet]
        [Route("case/{caseId:guid}")]
        public IActionResult GetTasksByCase(Guid caseId)
        {
            var tasks = dbContext.LegalTasks
                .Where(t => t.CaseId == caseId)
                .ToList();

            return Ok(tasks);
        }
    }
}
