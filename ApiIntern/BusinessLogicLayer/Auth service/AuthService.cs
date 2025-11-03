using BusinessLogicLayer.Dtos.Auth;
using DataAccessLayer.Entites;
using DataAccessLayer.Interfaces.Users_Repository;
using DataAccessLayer.Services.Security;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;




namespace BusinessLogicLayer
{
    public class AuthService(IUserRepository users, IOptions<JwtOptions> jwtOptions) : IAuthService
    {
        private readonly IUserRepository _users = users;
        private readonly JwtOptions _jwt = jwtOptions.Value;

        public async Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync()
        {
            var list = await _users.GetAllAsync();
            return list.Select(u => new UserResponseDto
            {
                Id = u.Id,
                Username = u.Username,
            }).ToList();
        }
        // To return a list instead of an enumerable — lists support indexing, counting, etc.
        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
        {
            if (await _users.UsernameExistsAsync(dto.Username))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Username already exists."
                };
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = dto.Username,
                PasswordHash = PasswordHasher.Hash(dto.Password),
            };

            await _users.AddAsync(user);
            await _users.SaveChangesAsync();

            return new AuthResponseDto
            {
                Success = true,
                Message = "User registered successfully.",
                Username = user.Username,
                Token = BuildToken(user).Token,
                ExpiresAtUtc = BuildToken(user).ExpiresAtUtc
            };
        }


        public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto dto)
        {
            var user = await _users.GetByUsernameAsync(dto.Username);
            if (user is null || !PasswordHasher.Verify(dto.Password, user.PasswordHash))
                return null; 

            return BuildToken(user);
        }

        private AuthResponseDto BuildToken(User user)
        {
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new("name", user.Username),
                new("role", user.IsAdmin ? "Admin" : "User"),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SigningKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(_jwt.ExpiryMinutes);

            var token = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new AuthResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAtUtc = expires,
                Username = user.Username,
                IsAdmin = user.IsAdmin,
            };
        }
    }
}

