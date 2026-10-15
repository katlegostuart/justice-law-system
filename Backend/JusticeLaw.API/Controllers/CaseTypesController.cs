using JusticeLaw.API.Data;
using JusticeLaw.API.Models;
using JusticeLaw.API.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace JusticeLaw.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CaseTypesController : ControllerBase
    {
        private readonly LawDBContext dbContext;

        public CaseTypesController(LawDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllCaseTypes()
        {
            return Ok(dbContext.CaseTypes.ToList());
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult AddCaseType(AddCaseTypeDto addCaseTypeDto)
        {
            var caseTypeEntity = new CaseType() { Name = addCaseTypeDto.Name };
            dbContext.CaseTypes.Add(caseTypeEntity);
            dbContext.SaveChanges();
            return Ok(caseTypeEntity);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetCaseType(Guid id)
        {
            var caseType = dbContext.CaseTypes.Find(id);
            if (caseType == null) return NotFound();
            return Ok(caseType);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateCaseType(Guid id, UpdateCaseTypeDto updateCaseTypeDto)
        {
            var caseType = dbContext.CaseTypes.Find(id);
            if (caseType == null) return NotFound();

            caseType.Name = updateCaseTypeDto.Name;
            dbContext.SaveChanges();
            return Ok(caseType);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteCaseType(Guid id)
        {
            var caseType = dbContext.CaseTypes.Find(id);
            if (caseType == null) return NotFound();

            dbContext.CaseTypes.Remove(caseType);
            dbContext.SaveChanges();
            return Ok(caseType);
        }
    }
}
