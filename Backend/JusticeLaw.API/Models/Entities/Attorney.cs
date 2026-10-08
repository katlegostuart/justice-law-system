using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models.Entities
{
    public class Attorney
    {
        public Guid Id { get; set; }

        [StringLength(20)]
        public required string StaffNumber { get; set; }

        [StringLength(50)]
        public required string Name { get; set; }

        [StringLength(50)]
        public required string Surname { get; set; }

        [StringLength(20)]
        public required string Gender { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public required string Email { get; set; }

        [Phone]
        [StringLength(20)]
        public required string PhoneNumber { get; set; }

        [StringLength(50)]
        public required string Specialization { get; set; }

        // One Attorney -> Many Cases
        public ICollection<Case> Cases { get; set; } = new List<Case>();
    }
}
