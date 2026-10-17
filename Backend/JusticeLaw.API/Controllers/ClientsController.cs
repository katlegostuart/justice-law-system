using JusticeLaw.API.Data;
using JusticeLaw.API.Models;
using JusticeLaw.API.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace JusticeLaw.API.Controllers
{
    // Admins and attorneys can reach this controller.
    // Only the client LIST is open to attorneys (needed to pick a client for a new case).
    // Every other action is Admin only.
    [Authorize(Roles = "Admin,Attorney")]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly LawDBContext dbContext;

        public ClientsController(LawDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/Clients
        [HttpGet]
        public IActionResult GetAllClients()
        {
            return Ok(dbContext.Clients.ToList());
        }

        // POST: api/Clients
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult AddClient(AddClientDto addClientDto)
        {
            var clientEntity = new Client()
            {
                ClientNumber = addClientDto.ClientNumber,
                Name = addClientDto.Name,
                Surname = addClientDto.Surname,
                Gender = addClientDto.Gender,
                DateOfBirth = addClientDto.DateOfBirth,
                HomeAddress = addClientDto.HomeAddress,
                Email = addClientDto.Email,
                PhoneNumber = addClientDto.PhoneNumber,
                IdPassportNumber = addClientDto.IdPassportNumber
            };

            dbContext.Clients.Add(clientEntity);
            dbContext.SaveChanges();

            return Ok(clientEntity);
        }

        // GET: api/Clients/{id}
        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetClient(Guid id)
        {
            var client = dbContext.Clients.Find(id);
            if (client == null) return NotFound();

            return Ok(client);
        }

        // PUT: api/Clients/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateClient(Guid id, UpdateClientDto updateClientDto)
        {
            var client = dbContext.Clients.Find(id);
            if (client == null) return NotFound();

            client.ClientNumber = updateClientDto.ClientNumber;
            client.Name = updateClientDto.Name;
            client.Surname = updateClientDto.Surname;
            client.Gender = updateClientDto.Gender;
            client.DateOfBirth = updateClientDto.DateOfBirth;
            client.HomeAddress = updateClientDto.HomeAddress;
            client.Email = updateClientDto.Email;
            client.PhoneNumber = updateClientDto.PhoneNumber;
            client.IdPassportNumber = updateClientDto.IdPassportNumber;

            dbContext.SaveChanges();

            return Ok(client);
        }

        // DELETE: api/Clients/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteClient(Guid id)
        {
            var client = dbContext.Clients.Find(id);
            if (client == null) return NotFound();

            dbContext.Clients.Remove(client);
            dbContext.SaveChanges();

            return Ok(client);
        }

        // GET: api/Clients/search?query=smith
        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("search")]
        public IActionResult SearchClients(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return Ok(dbContext.Clients.ToList());
            }

            var clients = dbContext.Clients
                .Where(c => c.ClientNumber.Contains(query) ||
                            c.Name.Contains(query) ||
                            c.Surname.Contains(query))
                .ToList();

            return Ok(clients);
        }
    }
}