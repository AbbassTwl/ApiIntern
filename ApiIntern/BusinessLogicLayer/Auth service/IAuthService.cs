using BusinessLogicLayer.Dtos.Auth;

namespace BusinessLogicLayer
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
        Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync();
    }
}
