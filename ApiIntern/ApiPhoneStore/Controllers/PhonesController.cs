using BusinessLogicLayer.Dtos.Phones;
using BusinessLogicLayer.Phones;
using DataAccessLayer.Entites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PresantationLayer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhonesController(IPhoneService _service) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin , User")]

        public async Task<IActionResult> GetPhones(
            [FromQuery] int brandId,
            [FromQuery] string? search = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6)
        {

            var phones = await _service.GetPhonesAsync(brandId, search,  page, pageSize); 
            return Ok(phones);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin , User")]
        public async Task<IActionResult> GetPhone(int id)
        {
            var phone = await _service.GetPhoneByIdAsync(id);
            if (phone == null) return NotFound();
            return Ok(phone);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> CreatePhone([FromBody] PhoneRequestDto phone)
        {
            var created = await _service.AddPhoneAsync(phone);
            return CreatedAtAction(nameof(GetPhone), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> Update(int id, PhoneRequestDto dto)
        {
            var result = await _service.UpdatePhoneAsync(id, dto);
            if (result is null) return NotFound();
            return Ok(result);
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> DeletePhone(int id)
        {
            var deleted = await _service.DeletePhoneAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
