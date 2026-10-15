using JusticeLaw.API.Data;
using JusticeLaw.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JusticeLaw.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MeController : ControllerBase
    {
        private readonly LawDBContext dbContext;

        public MeController(LawDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var email = User.FindFirstValue(ClaimTypes.Email);
            var role = User.FindFirstValue(ClaimTypes.Role);

            var response = new MeDto
            {
                UserId = userId,
                Email = email,
                Role = role,
                Name = email ?? "Unknown"
            };

            if (role == "Attorney")
            {
                var attorney = dbContext.Attorneys.FirstOrDefault(a => a.UserId == userId);
                if (attorney != null)
                {
                    response.Name = $"{attorney.Name} {attorney.Surname}";
                    response.StaffNumber = attorney.StaffNumber;
                }
            }
            else if (role == "Client")
            {
                var client = dbContext.Clients.FirstOrDefault(c => c.UserId == userId);
                if (client != null)
                {
                    response.Name = $"{client.Name} {client.Surname}";
                    response.ClientNumber = client.ClientNumber;
                }
            }

            return Ok(response);
        }
    }
}