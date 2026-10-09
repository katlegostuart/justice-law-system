using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models
{
    public class UpdateClientDto
    {
        [Required] public required string ClientNumber { get; set; }
        [Required] public required string Name { get; set; }
        [Required] public required string Surname { get; set; }
        [Required] public required string Gender { get; set; }
        [Required] public DateTime DateOfBirth { get; set; }
        [Required] public required string HomeAddress { get; set; }
        [Required][EmailAddress] public required string Email { get; set; }
        [Required][Phone] public required string PhoneNumber { get; set; }
        [Required] public required string IdPassportNumber { get; set; }
    }
}
