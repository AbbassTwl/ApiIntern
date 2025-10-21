import { Client } from "./Client";
import type { BrandRequestDto, BrandResponseDto } from "@/Dto/Brand.dto";

export const BrandClient = {
  async getBrands(brandId?: string, search?: string, page = 1, pageSize = 100) {
    const { data } = await Client.get<BrandResponseDto[]>("/Brands", {
      params: { brandId, search, page, pageSize },
    });
    return data ?? [];
  },

  async getBrand(id: number) {
    const { data } = await Client.get<BrandResponseDto>(`/Brands/${id}`);
    return data;
  },

  async createBrand(dto: BrandRequestDto) {
    const { data } = await Client.post<BrandResponseDto>("/Brands", dto);
    return data;
  },

  async updateBrand(id: number, dto: BrandRequestDto) {
    const { data } = await Client.put<BrandResponseDto>(`/Brands/${id}`, dto);
    return data;
  },

  async deleteBrand(id: number) {
    await Client.delete(`/Brands/${id}`);
  },
};
