using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models
{
    public class UpdateCaseDto
    {
        [Required] public required string CaseNumber { get; set; }
        [Required] public required string CaseName { get; set; }
        [Required] public required string CaseDescription { get; set; }
        public DateTime DateOpened { get; set; }
        [Required] public required string CaseStatus { get; set; }
        [Required] public Guid CaseTypeId { get; set; }
        [Required] public Guid ClientId { get; set; }
        public Guid? AttorneyId { get; set; }
    }
}
