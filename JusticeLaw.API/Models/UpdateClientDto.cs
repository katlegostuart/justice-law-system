namespace LAW.Api.Models
{
    public class UpdateClientDto
    {
        public required string ClientNumber { get; set; }
        public required string Name { get; set; }
        public required string Surname { get; set; }
        public required string Gender { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public required string HomeAddress { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string IdPassportNumber { get; set; }
    }
}