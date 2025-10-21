import { Client } from "./Client";
import type { PhoneRequestDto, PhoneResponseDto } from "@/Dto/Phone.dto";

export const PhoneClient = {

  async getPhones(brandId: number, search?: string, page = 1, pageSize = 6) {
    const params: Record<string, string | number> = { brandId, page, pageSize };
    if (search && search.trim()) params.search = search.trim();
    const { data } = await Client.get<PhoneResponseDto[]>("/Phones", { params });
    return data ?? [];
  },

  async getPhone(id: number) {
    const { data } = await Client.get<PhoneResponseDto>(`/Phones/${id}`);
    return data;
  },

  async createPhone(dto: PhoneRequestDto) {
    const { data } = await Client.post<PhoneResponseDto>("/Phones", dto);
    return data;
  },

  async updatePhone(id: number, dto: PhoneRequestDto) {
    const { data } = await Client.put<PhoneResponseDto>(`/Phones/${id}`, dto);
    return data;
  },

  async deletePhone(id: number) {
    await Client.delete(`/Phones/${id}`);
  },
};
