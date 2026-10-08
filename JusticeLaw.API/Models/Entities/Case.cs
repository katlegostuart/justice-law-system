using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models.Entities
{
    public class Case
    {
        public Guid Id { get; set; }
        [StringLength(20)]
        public required string CaseNumber { get; set; }

        [StringLength(100)]
        public required string CaseName { get; set; }

        [StringLength(1000)]
        public required string CaseDescription { get; set; }

        public DateTime DateOpened { get; set; }

        // Open, In Progress, Pending, Closed
        [StringLength(20)]
        public string CaseStatus { get; set; } = "Open";

        // Foreign key + navigation: Case -> Case Type
        public Guid CaseTypeId { get; set; }
        public CaseType? CaseType { get; set; }

        // Foreign key + navigation: Case -> Client
        public Guid ClientId { get; set; }
        public Client? Client { get; set; }

        // Foreign key + navigation: Case -> Attorney
        // Nullable because the Admin assigns the attorney after the case is created
        public Guid? AttorneyId { get; set; }
        public Attorney? Attorney { get; set; }

        // One Case -> Many Legal Tasks
        public ICollection<LegalTask> LegalTasks { get; set; } = new List<LegalTask>();
    }
}
