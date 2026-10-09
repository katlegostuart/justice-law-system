using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models
{
    public class AddAttorneyDto
    {
        [Required] public required string StaffNumber { get; set; }
        [Required] public required string Name { get; set; }
        [Required] public required string Surname { get; set; }
        [Required] public required string Gender { get; set; }
        [Required][EmailAddress] public required string Email { get; set; }
        [Required][Phone] public required string PhoneNumber { get; set; }
        [Required] public required string Specialization { get; set; }
    }
}
