using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models
{
    public class RegisterDto
    {
        [EmailAddress]
        public required string Email { get; set; }

        [StringLength(100, MinimumLength = 6)]
        public required string Password { get; set; }

        // "Attorney" or "Client"
        public required string Role { get; set; }

        // Id of the Attorney or Client record this login belongs to
        public Guid? RecordId { get; set; }
    }
}
