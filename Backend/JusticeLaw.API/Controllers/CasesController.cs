using JusticeLaw.API.Data;
using JusticeLaw.API.Models;
using JusticeLaw.API.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace JusticeLaw.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CasesController : ControllerBase
    {
        private readonly LawDBContext dbContext;

        public CasesController(LawDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/Cases?status=Open
        [HttpGet]
        public IActionResult GetAllCases(string? status)
        {
            var query = dbContext.Cases
                .Include(c => c.Client)
                .Include(c => c.Attorney)
                .Include(c => c.CaseType)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(c => c.CaseStatus == status);
            }

            return Ok(query.ToList());
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult AddCase(AddCaseDto addCaseDto)
        {
            var caseEntity = new Case()
            {
                CaseNumber = addCaseDto.CaseNumber,
                CaseName = addCaseDto.CaseName,
                CaseDescription = addCaseDto.CaseDescription,
                DateOpened = addCaseDto.DateOpened,
                CaseStatus = addCaseDto.CaseStatus,
                CaseTypeId = addCaseDto.CaseTypeId,
                ClientId = addCaseDto.ClientId,
                AttorneyId = addCaseDto.AttorneyId
            };

            dbContext.Cases.Add(caseEntity);
            dbContext.SaveChanges();

            return Ok(caseEntity);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetCase(Guid id)
        {
            var legalCase = dbContext.Cases
                .Include(c => c.Client)
                .Include(c => c.Attorney)
                .Include(c => c.CaseType)
                .FirstOrDefault(c => c.Id == id);

            if (legalCase == null) return NotFound();

            return Ok(legalCase);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateCase(Guid id, UpdateCaseDto updateCaseDto)
        {
            var legalCase = dbContext.Cases.Find(id);
            if (legalCase == null) return NotFound();

            legalCase.CaseNumber = updateCaseDto.CaseNumber;
            legalCase.CaseName = updateCaseDto.CaseName;
            legalCase.CaseDescription = updateCaseDto.CaseDescription;
            legalCase.DateOpened = updateCaseDto.DateOpened;
            legalCase.CaseStatus = updateCaseDto.CaseStatus;
            legalCase.CaseTypeId = updateCaseDto.CaseTypeId;
            legalCase.ClientId = updateCaseDto.ClientId;
            legalCase.AttorneyId = updateCaseDto.AttorneyId;

            dbContext.SaveChanges();

            return Ok(legalCase);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteCase(Guid id)
        {
            var legalCase = dbContext.Cases.Find(id);
            if (legalCase == null) return NotFound();

            dbContext.Cases.Remove(legalCase);
            dbContext.SaveChanges();

            return Ok(legalCase);
        }

        // GET: api/Cases/search?query=Smith
        [HttpGet]
        [Route("search")]
        public IActionResult SearchCases(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return Ok(dbContext.Cases.ToList());
            }

            var cases = dbContext.Cases
                .Include(c => c.Client)
                .Include(c => c.Attorney)
                .Include(c => c.CaseType)
                .Where(c => c.CaseNumber.Contains(query) ||
                            c.CaseName.Contains(query) ||
                            (c.CaseType != null && c.CaseType.Name.Contains(query)))
                .ToList();

            return Ok(cases);
        }
    }
}
