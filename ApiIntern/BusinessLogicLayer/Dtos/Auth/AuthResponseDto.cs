using System;

namespace BusinessLogicLayer.Dtos.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = default!;
        public DateTime ExpiresAtUtc { get; set; }
        public string Username { get; set; } = default!;
        //public bool IsAdmin { get; set; }
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}
