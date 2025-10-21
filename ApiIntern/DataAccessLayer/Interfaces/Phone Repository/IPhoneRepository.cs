using DataAccessLayer.Entites;

namespace DataAccessLayer.Interfaces;

public interface IPhoneRepository
{
    Task<List<Phone>> GetPhonesAsync(int brandId, string? search, int page, int pageSize);
    Task<Phone?> GetPhoneByIdWithBrandAsync(int id);
    Task<Phone> AddPhoneAsync(Phone phone);
    Task<Phone?> UpdatePhoneAsync(int id, Phone phone);
    Task<bool> DeletePhoneAsync(int id);
}
