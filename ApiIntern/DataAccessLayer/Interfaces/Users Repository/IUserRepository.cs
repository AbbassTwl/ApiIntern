using DataAccessLayer.Entites;

namespace DataAccessLayer.Interfaces.Users_Repository
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByIdAsync(Guid id);
        Task<bool> UsernameExistsAsync(string username);
        Task<IReadOnlyList<User>> GetAllAsync(); 
        Task AddAsync(User user);
        void Update(User user);
        void Remove(User user);
        Task SaveChangesAsync();
    }
}
