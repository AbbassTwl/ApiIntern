namespace BusinessLogicLayer.Dtos.Phones
{
    public class PhoneResponseDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? BrandName { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }

    }
}
