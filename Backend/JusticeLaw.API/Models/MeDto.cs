namespace JusticeLaw.API.Models
{
    public class MeDto
    {
        public string? UserId { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? StaffNumber { get; set; }
        public string? ClientNumber { get; set; }
    }
}