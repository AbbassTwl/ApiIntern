using BusinessLogicLayer.Dtos.Brands;
using DataAccessLayer.Entites;

namespace BusinessLogicLayer.Brands
{
    public interface IBrandService
    {
        Task<IEnumerable<BrandResponseDto>> GetBrandsAsync(string? id, string? search, int page, int pageSize);
        Task<BrandResponseDto?> GetBrandByIdAsync(int id);
        Task<BrandResponseDto> AddBrandAsync(BrandRequestDto request);
        Task<BrandResponseDto> UpdateBrandAsync(int id, BrandRequestDto request);
        Task<bool> DeleteBrandAsync(int id);
    }
}
