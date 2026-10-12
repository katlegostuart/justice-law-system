using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models
{
    public class AddTaskDto
    {
        [Required] public required string TaskName { get; set; }
        [Required] public required string Description { get; set; }
        [Required] public DateTime DueDate { get; set; }
        public string Status { get; set; } = "Not Started";
        [Required] public Guid CaseId { get; set; }
    }
}
