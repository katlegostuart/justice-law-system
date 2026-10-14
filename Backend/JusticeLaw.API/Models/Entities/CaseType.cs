using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace JusticeLaw.API.Models.Entities
{
    public class CaseType
    {
        public Guid Id { get; set; }

        // e.g. Criminal, Civil, Family, Labour, Commercial, Property
        [StringLength(50)]
        public required string Name { get; set; }

        // One Case Type -> Many Cases
        [JsonIgnore]
        public ICollection<Case> Cases { get; set; } = new List<Case>();
    }
}
