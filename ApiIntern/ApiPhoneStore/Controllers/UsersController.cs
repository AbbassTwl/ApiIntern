using BusinessLogicLayer;
using BusinessLogicLayer.Dtos.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PresentationLayer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class UsersController(IAuthService _auth) : ControllerBase
    {
        [HttpGet("me")]
        public IActionResult Me()
        {
            var name = User.Identity?.Name;
            var isAdmin = User.IsInRole("Admin");
            var accountAdmin = User.Claims.FirstOrDefault(c => c.Type == "account_admin")?.Value;
            return Ok(new { name, isAdmin, accountAdmin });
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IReadOnlyList<UserResponseDto>>> GetAll()
        {
            var list = await _auth.GetAllUsersAsync();
            return Ok(list);
        }
    }
}
