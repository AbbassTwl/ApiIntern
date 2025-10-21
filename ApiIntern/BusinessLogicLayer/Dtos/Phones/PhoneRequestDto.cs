﻿namespace BusinessLogicLayer.Dtos.Phones
{
    public class PhoneRequestDto
    {
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public required string Description { get; set; }
        public required string ImageUrl { get; set; }
        public required int BrandId { get; set; }

    }
}
