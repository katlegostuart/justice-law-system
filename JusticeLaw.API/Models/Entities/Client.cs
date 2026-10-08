using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models.Entities
{
    public class Client
    {
        public Guid Id { get; set; }
        [StringLength(20)]
        public required string ClientNumber { get; set; }

        [StringLength(50)]
        public required string Name { get; set; }

        [StringLength(50)]
        public required string Surname { get; set; }

        [StringLength(20)]
        public required string Gender { get; set; }

        public DateTime DateOfBirth { get; set; }

        [StringLength(200)]
        public required string HomeAddress { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public required string Email { get; set; }

        [Phone]
        [StringLength(20)]
        public required string PhoneNumber { get; set; }

        [StringLength(20)]
        public required string IdPassportNumber { get; set; }

        // One Client -> Many Cases
        public ICollection<Case> Cases { get; set; } = new List<Case>();
    }
}
