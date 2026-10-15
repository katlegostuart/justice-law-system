using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models
{
    public class LoginDto
    {
        [EmailAddress]
        public required string Email { get; set; }

        public required string Password { get; set; }
    }
}

