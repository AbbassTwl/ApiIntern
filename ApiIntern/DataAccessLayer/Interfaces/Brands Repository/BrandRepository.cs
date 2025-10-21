using ApiPhoneStore.Data;
using DataAccessLayer.Entites;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Interfaces
{
    public class BrandRepository(AppDbContext dbContext) : IBrandRepository
    {
        public async Task<IEnumerable<Brand>> GetBrandsAsync(string? search, string? search1, int page, int pageSize)
        {
            var query = dbContext.Brands.AsQueryable();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(p => p.Name != null && p.Name.ToLower().Contains(search.ToLower()));

            return await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(); // Executes the query asynchronously and converts the results into a List.
        }
        public async Task<Brand?> GetBrandByIdAsync(int id)
        {
            return await dbContext.Brands.FindAsync(id);
        }


        public async Task<Brand> AddBrandAsync(Brand brand)
        {
            dbContext.Brands.Add(brand);
            await dbContext.SaveChangesAsync();
            return brand;
        }

        public async Task<Brand?> UpdateBrandAsync(int id, Brand brand)
        {
            var existing = await dbContext.Brands.FindAsync(id);
            if (existing == null) return null;

            existing.Name = brand.Name;
            existing.Description = brand.Description;

            await dbContext.SaveChangesAsync();
            return existing;
        }
        public async Task<bool> DeleteBrandAsync(int id)
        {
            var brand = await dbContext.Brands.FindAsync(id);
            if (brand == null) return false;

            dbContext.Brands.Remove(brand);
            await dbContext.SaveChangesAsync();
            return true;
        }

    }
}
