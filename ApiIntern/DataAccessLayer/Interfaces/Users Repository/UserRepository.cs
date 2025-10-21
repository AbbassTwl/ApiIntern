using ApiPhoneStore.Data;
using DataAccessLayer.Entites;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Interfaces.Users_Repository
{
    public class UserRepository(AppDbContext db) : IUserRepository
    {
        public Task<User?> GetByUsernameAsync(string username) =>
            db.Users.FirstOrDefaultAsync(u => u.Username == username);

        public Task<User?> GetByIdAsync(Guid id) =>
            db.Users.FirstOrDefaultAsync(u => u.Id == id);

        public Task<bool> UsernameExistsAsync(string username) =>
            db.Users.AnyAsync(u => u.Username == username);

        public async Task<IReadOnlyList<User>> GetAllAsync() =>
            await db.Users.AsNoTracking().ToListAsync();

        public async Task AddAsync(User user) => await db.Users.AddAsync(user);

        public void Update(User user) => db.Users.Update(user);

        public void Remove(User user) => db.Users.Remove(user);

        public Task SaveChangesAsync() => db.SaveChangesAsync();
    }
}
