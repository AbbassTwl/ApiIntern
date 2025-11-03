using BusinessLogicLayer.Dtos.Phones;
using DataAccessLayer.Entites;

namespace BusinessLogicLayer.Phones
{
    public interface IPhoneService
    {
        Task<IEnumerable<PhoneResponseDto>> GetPhonesAsync(int brandId, string search, int page, int pageSize);
        Task<PhoneResponseDto?> GetPhoneByIdAsync(int id);
        Task<PhoneResponseDto> AddPhoneAsync(PhoneRequestDto request);
        Task<PhoneResponseDto?> UpdatePhoneAsync( int id, PhoneRequestDto request);
        Task<bool> DeletePhoneAsync(int id);

    }
}

