using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models
{
    public class UpdateCaseTypeDto
    {
        [Required] public required string Name { get; set; }
    }
}
