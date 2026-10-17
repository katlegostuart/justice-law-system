using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

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

        public string? UserId { get; set; }

        [StringLength(30)]
        public string Tier { get; set; } = "Associate Advocate";

        public int Capacity { get; set; } = 8;

        // One Attorney -> Many Cases
        [JsonIgnore]
        public ICollection<Case> Cases { get; set; } = new List<Case>();
    }
}
