using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models
{
    public class UpdateTaskDto
    {
        [Required] public required string TaskName { get; set; }
        [Required] public required string Description { get; set; }
        [Required] public DateTime DueDate { get; set; }
        [Required] public required string Status { get; set; }
    }
}
