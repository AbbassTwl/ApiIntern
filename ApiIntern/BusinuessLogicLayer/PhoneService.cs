using PhoneStoreApi.Data.Repositories;
using PhoneStoreApi.Models;
using PhoneStoreApi.Services.Interfaces;
using System.Numerics;

namespace PhoneStoreApi.Services
{
    public class PhoneService : IPhoneService
    {
        private readonly IPhoneRepository _repository;

        public PhoneService(IPhoneRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<Phone>> GetPhonesAsync(string brand, string search, int page, int pageSize)
        {
            return _repository.GetPhonesAsync(brand, search, page, pageSize);
        }

        public Task<Phone?> GetPhoneByIdAsync(int id) => _repository.GetPhoneByIdAsync(id);

        public Task<Phone> AddPhoneAsync(Phone phone) => _repository.AddPhoneAsync(phone);

        public Task<Phone?> UpdatePhoneAsync(int id, Phone phone) => _repository.UpdatePhoneAsync(id, phone);

        public Task<bool> DeletePhoneAsync(int id) => _repository.DeletePhoneAsync(id);
    }
}
