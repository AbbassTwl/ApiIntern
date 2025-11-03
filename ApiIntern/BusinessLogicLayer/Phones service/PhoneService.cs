using BusinessLogicLayer.Dtos.Phones;
using DataAccessLayer.Entites;
using DataAccessLayer.Interfaces;

namespace BusinessLogicLayer.Phones
{
    public class PhoneService(IPhoneRepository repository) : IPhoneService
    {

        public async Task<IEnumerable<PhoneResponseDto>> GetPhonesAsync(int brandId, string? search, int page, int pageSize)
        {
            var phones = await repository.GetPhonesAsync(brandId, search, page, pageSize);
            return phones.Select(p => new PhoneResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                BrandName = p.Brand!.Name,
                Description = p.Description,
                ImageUrl = p.ImageUrl
            });
        }

        public async Task<PhoneResponseDto?> GetPhoneByIdAsync(int id)
        {
            var phone = await repository.GetPhoneByIdWithBrandAsync(id);
            if (phone is null) return null;

            return new PhoneResponseDto
            {
                Id = phone.Id,
                Name = phone.Name,
                Price = phone.Price,
                BrandName = phone.Brand!.Name,
                Description = phone.Description,
                ImageUrl = phone.ImageUrl

            };
        }

        public async Task<PhoneResponseDto> AddPhoneAsync(PhoneRequestDto request)
        {
            var phone = new Phone
            {
                Name = request.Name,
                Price = request.Price,
                Description = request.Description,
                BrandId = request.BrandId,
                ImageUrl = request.ImageUrl,

            };
            var created = await repository.AddPhoneAsync(phone);

            return new PhoneResponseDto
            {
                Id = created.Id,
            };
        }

        public async Task<PhoneResponseDto?> UpdatePhoneAsync(int id, PhoneRequestDto request)
        {
            var phone = new Phone
            {
                Id = id,
                Name = request.Name,
                Price = request.Price,
                Description = request.Description,
                BrandId = request.BrandId,
                ImageUrl = request.ImageUrl
            };

            var updated = await repository.UpdatePhoneAsync(id, phone);
            if (updated is null) return null;

            return new PhoneResponseDto
            {
                Name = updated.Name,
                Price = updated.Price,
                BrandName = updated.Brand?.Name,
                Description = updated.Description,
                ImageUrl = updated.ImageUrl
            };
        }


        public Task<bool> DeletePhoneAsync(int id)
        {
            return repository.DeletePhoneAsync(id);
        }
    }
}

// IEnumerable<T> is an interface in C# that represents a sequence of elements that can be iterated (looped) over one by one.