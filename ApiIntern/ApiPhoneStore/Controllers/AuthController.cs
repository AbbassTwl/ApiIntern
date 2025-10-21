using BusinessLogicLayer;
using BusinessLogicLayer.Dtos.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PresentationLayer.Controllers

{

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService _auth) : ControllerBase
    {
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto dto)
        {
            var result = await _auth.RegisterAsync(dto);

            if (!result.Success)
                return Conflict(new { message = result.Message });  

            return Ok(result); 
        }




        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto dto)
        {
            var result = await _auth.LoginAsync(dto);
            if (result is null)
                return Unauthorized(new { message = "Invalid username or password" });

            return Ok(result);
        }
    }
}
