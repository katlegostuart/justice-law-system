using JusticeLaw.API.Data;
using JusticeLaw.API.Models;
using JusticeLaw.API.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Timers;

namespace JusticeLaw.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AttorneysController : ControllerBase
    {
        private readonly LawDBContext dbContext;

        public AttorneysController(LawDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllAttorneys()
        {
            return Ok(dbContext.Attorneys.ToList());
        }

        [HttpPost]
        public IActionResult AddAttorney(AddAttorneyDto addAttorneyDto)
        {
            var attorneyEntity = new Attorney()
            {
                StaffNumber = addAttorneyDto.StaffNumber,
                Name = addAttorneyDto.Name,
                Surname = addAttorneyDto.Surname,
                Gender = addAttorneyDto.Gender,
                Email = addAttorneyDto.Email,
                PhoneNumber = addAttorneyDto.PhoneNumber,
                Specialization = addAttorneyDto.Specialization,
                Tier = addAttorneyDto.Tier,          // in UpdateAttorney use updateAttorneyDto.Tier
                Capacity = addAttorneyDto.Capacity,  // in UpdateAttorney use updateAttorneyDto.Capacity
            };

            dbContext.Attorneys.Add(attorneyEntity);
            dbContext.SaveChanges();

            return Ok(attorneyEntity);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetAttorney(Guid id)
        {
            var attorney = dbContext.Attorneys.Find(id);
            if (attorney == null) return NotFound();

            return Ok(attorney);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateAttorney(Guid id, UpdateAttorneyDto updateAttorneyDto)
        {
            var attorney = dbContext.Attorneys.Find(id);
            if (attorney == null) return NotFound();

            attorney.StaffNumber = updateAttorneyDto.StaffNumber;
            attorney.Name = updateAttorneyDto.Name;
            attorney.Surname = updateAttorneyDto.Surname;
            attorney.Gender = updateAttorneyDto.Gender;
            attorney.Email = updateAttorneyDto.Email;
            attorney.PhoneNumber = updateAttorneyDto.PhoneNumber;
            attorney.Specialization = updateAttorneyDto.Specialization;
            attorney.Tier = updateAttorneyDto.Tier;
            attorney.Capacity = updateAttorneyDto.Capacity;

            dbContext.SaveChanges();

            return Ok(attorney);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteAttorney(Guid id)
        {
            var attorney = dbContext.Attorneys.Find(id);
            if (attorney == null) return NotFound();

            dbContext.Attorneys.Remove(attorney);
            dbContext.SaveChanges();

            return Ok(attorney);
        }

        // GET: api/Attorneys/search?query=smith
        [HttpGet]
        [Route("search")]
        public IActionResult SearchAttorneys(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return Ok(dbContext.Attorneys.ToList());
            }

            var attorneys = dbContext.Attorneys
                .Where(a => a.StaffNumber.Contains(query) ||
                            a.Name.Contains(query) ||
                            a.Surname.Contains(query))
                .ToList();

            return Ok(attorneys);
        }
    }
}
