export type PhoneRequestDto = {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  brandId: number;
};

export type PhoneResponseDto = {
  id: number;
  name?: string | null;
  brandName?: string | null;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
};
