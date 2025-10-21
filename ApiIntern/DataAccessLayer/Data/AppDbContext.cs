using DataAccessLayer.Entites;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using DataAccessLayer.Services.Security;


namespace ApiPhoneStore.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options ) : DbContext(options)
    {
        public DbSet<Phone> Phones { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<User> Users { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Brand>().HasData(
                new Brand { Id = 1, Name = "Samsung", Description = "Samsung brand description" },
                new Brand { Id = 2, Name = "Apple", Description = "Apple brand description" },
                new Brand { Id = 3, Name = "Tecno", Description = "Tecno brand description" }
            );

            modelBuilder.Entity<Phone>().HasData(
                Enumerable.Range(1, 6).Select(i => new Phone
                {
                    Id = i,
                    Name = $"Samsung Galaxy S{i}",
                    BrandId = 1,
                    Price = 799 + i,
                    Description = "Samsung phone description",
                    ImageUrl = "https://example.com/samsung.jpg"
                })
                .Concat(Enumerable.Range(7, 6).Select(i => new Phone
                {
                    Id = i,
                    Name = $"iPhone {i - 6}",
                    BrandId = 2,
                    Price = 999 + i,
                    Description = "Apple phone description",
                    ImageUrl = "https://example.com/apple.jpg"
                }))
                .Concat(Enumerable.Range(13, 6).Select(i => new Phone
                {
                    Id = i,
                    Name = $"Tecno Spark {i - 12}",
                    BrandId = 3,
                    Price = 299 + i,
                    Description = "Tecno phone description",
                    ImageUrl = "https://example.com/tecno.jpg"
                }))
            );


        }
    }
}
