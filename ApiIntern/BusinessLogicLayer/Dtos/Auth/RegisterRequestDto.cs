namespace BusinessLogicLayer.Dtos.Auth
{
    public class RegisterRequestDto
    {
        public string Username { get; set; } = default!;
        public string Password { get; set; } = default!;
        public bool AsAdmin { get; set; } = false;
    }
}
