import { Client } from "./Client";
import type { MeResponse, UserResponseDto } from "@/Dto/User.dto";

export const UserClient = {
  me: async () => {
    const { data } = await Client.get<MeResponse>("/Users/me");
    return data;
  },
  getAll: async () => {
    const { data } = await Client.get<UserResponseDto[]>("/Users"); // Admin only
    return data;
  },
};
