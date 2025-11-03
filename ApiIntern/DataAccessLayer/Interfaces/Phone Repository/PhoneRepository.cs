using ApiPhoneStore.Data;
using DataAccessLayer.Entites;
using DataAccessLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

public class PhoneRepository : IPhoneRepository
{
    private readonly AppDbContext _db;
    public PhoneRepository(AppDbContext db) => _db = db;

    public async Task<List<Phone>> GetPhonesAsync(int brandId, string? search, int page, int pageSize)
    {
        var query = _db.Phones
            .AsNoTracking()     // This tells EF Core not to track changes to the retrieved entities.
            .Include(p => p.Brand)
            .AsQueryable(); // “This is still a query that hasn’t been executed yet.”    Keep it as a modifiable query

        if (brandId > 0)
            query = query.Where(p => p.BrandId == brandId);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(p =>
                (p.Name != null && p.Name.ToLower().Contains(search.ToLower())) ||
                (p.Brand != null && p.Brand.Name != null && p.Brand.Name.ToLower().Contains(search.ToLower()))
            );

        return await query
            .OrderBy(p => p.BrandId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(); // Executes the query asynchronously and converts the results into a List.
    }

    public async Task<Phone?> GetPhoneByIdWithBrandAsync(int id)
        => await _db.Phones.Include(p => p.Brand).FirstOrDefaultAsync(p => p.Id == id);

    public async Task<Phone> AddPhoneAsync(Phone phone)
    {
        _db.Phones.Add(phone);
        await _db.SaveChangesAsync();
        return phone;
    }

    public async Task<Phone?> UpdatePhoneAsync(int id, Phone phone)
    {
        var existing = await _db.Phones.FindAsync(id);
        if (existing is null) return null;

        existing.Name = phone.Name;
        existing.Price = phone.Price;
        existing.Description = phone.Description;
        existing.BrandId = phone.BrandId;
        existing.ImageUrl = phone.ImageUrl;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeletePhoneAsync(int id)
    {
        var p = await _db.Phones.FindAsync(id);
        if (p is null) return false;
        _db.Phones.Remove(p);
        await _db.SaveChangesAsync();
        return true;
    }
}
