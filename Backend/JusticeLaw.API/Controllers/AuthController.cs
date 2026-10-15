using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JusticeLaw.API.Data;
using JusticeLaw.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace JusticeLaw.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly LawDBContext dbContext;
        private readonly IConfiguration configuration;

        public AuthController(UserManager<IdentityUser> userManager, LawDBContext dbContext, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
            this.configuration = configuration;
        }

        // Only an Admin can create logins for attorneys and clients
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (registerDto.Role != "Attorney" && registerDto.Role != "Client")
            {
                return BadRequest("Role must be Attorney or Client.");
            }

            var user = new IdentityUser { UserName = registerDto.Email, Email = registerDto.Email };
            var result = await userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await userManager.AddToRoleAsync(user, registerDto.Role);

            // Link the login to the Attorney / Client record
            if (registerDto.RecordId != null)
            {
                if (registerDto.Role == "Attorney")
                {
                    var attorney = await dbContext.Attorneys.FindAsync(registerDto.RecordId.Value);
                    if (attorney != null) attorney.UserId = user.Id;
                }
                else
                {
                    var client = await dbContext.Clients.FindAsync(registerDto.RecordId.Value);
                    if (client != null) client.UserId = user.Id;
                }
                await dbContext.SaveChangesAsync();
            }

            return Ok("User registered.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);
            if (user == null || !await userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                return Unauthorized("Invalid email or password.");
            }

            var roles = await userManager.GetRolesAsync(user);

            // The claims go inside the token: who the user is and what role(s) they have
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!)
            };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                email = user.Email,
                role = roles.FirstOrDefault()
            });
        }
    }
}
