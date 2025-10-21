using BusinessLogicLayer.Brands;
using BusinessLogicLayer.Dtos.Brands;
using BusinessLogicLayer.Phones;
using DataAccessLayer.Entites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiPhoneStore.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
        public class BrandsController(IBrandService _service) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin , User")]

        public async Task<IActionResult> GetBrand(
            [FromQuery] string? brandId = null,
            [FromQuery] string? search = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 3)
        {
            var brands = await _service.GetBrandsAsync(brandId ?? "", search ?? "", page, pageSize);
            return Ok(brands);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin , User")]

        public async Task<IActionResult> GetBrand(int id)
        {
            var brands = await _service.GetBrandByIdAsync(id);
            if (brands == null) return NotFound();
            return Ok(brands);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> CreateBrand([FromBody] BrandRequestDto brandRequest)
        {
            var created = await _service.AddBrandAsync(brandRequest);
            return CreatedAtAction(nameof(GetBrand), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> UpdateBrand(int id, [FromBody] BrandRequestDto brand)
        {
            var updated = await _service.UpdateBrandAsync(id, brand);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> DeleteBrand(int id)
        {
            var deleted = await _service.DeleteBrandAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}


// from query  ---- For filters, search parameters, or simple values passed in the URL.
// from body   ---- For complex objects sent in the request body, typically in POST or PUT requests.