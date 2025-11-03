using DataAccessLayer.Entites;

namespace DataAccessLayer.Interfaces
{
    public interface IBrandRepository
    {
        Task<IEnumerable<Brand>> GetBrandsAsync(string? search, string? search1, int page, int pageSize);
        Task<Brand?> GetBrandByIdAsync(int id);
        Task<Brand> AddBrandAsync(Brand brand);
        Task<Brand?> UpdateBrandAsync(int id, Brand brand);
        Task<bool> DeleteBrandAsync(int id);
    }
}

