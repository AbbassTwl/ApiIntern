namespace DataAccessLayer.Entites;

public class Phone
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public required string Description { get; set; }
    public string? ImageUrl { get; set; }
    public int BrandId { get; set; }
    public Brand? Brand { get; set; }
}