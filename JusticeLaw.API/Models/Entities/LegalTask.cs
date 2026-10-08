using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models.Entities
{
    public class LegalTask
    {
        public Guid Id { get; set; }

        [StringLength(100)]
        public required string TaskName { get; set; }

        [StringLength(500)]
        public required string Description { get; set; }

        public DateTime DueDate { get; set; }

        // Not Started, In Progress, Complete
        [StringLength(20)]
        public string Status { get; set; } = "Not Started";

        // Foreign key + navigation: Legal Task -> Case
        public Guid CaseId { get; set; }
        public Case? Case { get; set; }
    }
}
