using System.ComponentModel.DataAnnotations;

namespace JusticeLaw.API.Models
{
    public class AddCaseTypeDto
    {
        [Required] public required string Name { get; set; }
    }
}
