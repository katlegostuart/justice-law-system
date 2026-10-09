using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models
{
    public class AddCaseDto
    {
        [Required] public required string CaseNumber { get; set; }
        [Required] public required string CaseName { get; set; }
        [Required] public required string CaseDescription { get; set; }
        public DateTime DateOpened { get; set; } = DateTime.Now;
        public string CaseStatus { get; set; } = "Open";
        [Required] public Guid CaseTypeId { get; set; }
        [Required] public Guid ClientId { get; set; }
        public Guid? AttorneyId { get; set; } // Nullable because Admin assigns later
    }
}
