using BusinessLogicLayer.Dtos.Brands;
using DataAccessLayer.Entites;
using DataAccessLayer.Interfaces;
using System.Numerics;

namespace BusinessLogicLayer.Brands
    {
    public class BrandService(IBrandRepository repository) : IBrandService
    {
        private readonly IBrandRepository _repository = repository;

        public async Task<IEnumerable<BrandResponseDto?>> GetBrandsAsync(string? Id, string? search, int page, int pageSize)
        {
            var brands = await _repository.GetBrandsAsync(Id, search, page, pageSize);

            return brands.Select(b => new BrandResponseDto
            {
                Id = b.Id,
                Name = b.Name!,
                Description = b.Description != null ? b.Description : "No Description",
            });
        }

        public async Task<BrandResponseDto?> GetBrandByIdAsync(int id)
        {
            var brand = await _repository.GetBrandByIdAsync(id);
            if (brand is null) return null;

            return new BrandResponseDto
            {
                Id = brand.Id,
                Name = brand.Name!,
                Description = brand.Description != null ? brand.Description : "No Description",
            };
        }

        public async Task<BrandResponseDto> AddBrandAsync(BrandRequestDto request)
        {
            var brand = new Brand
            {
                Name = request.Name,
                Description = request.Description
            };

            var created = await _repository.AddBrandAsync(brand);

            return new BrandResponseDto
            {
                Id = created.Id,
                Name = created.Name!,
                Description = created.Description != null ? created.Description : "No Description"
            };
        }

        public async Task<BrandResponseDto?> UpdateBrandAsync(int id, BrandRequestDto request)
        {
            var brand = new Brand
            {
                Id = id,
                Name = request.Name,
                Description = request.Description
            };

            var updated = await _repository.UpdateBrandAsync(id , brand);
            if (updated is null) return null;
            return new BrandResponseDto
            {
                Id = updated.Id,
                Name = updated.Name!,
                Description = updated.Description != null ? updated.Description : "No Description"
            };
        }

        public Task<bool> DeleteBrandAsync(int id)
        {
            return _repository.DeleteBrandAsync(id);
        }
    }
}
