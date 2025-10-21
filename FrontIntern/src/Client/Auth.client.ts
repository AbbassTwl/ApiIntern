import { Client, setAuthToken } from "./Client";
import type { LoginRequestDto, RegisterRequestDto, AuthResponseDto } from "@/Dto/Auth.dto";

export const AuthClient = {
  async register(dto: RegisterRequestDto) {
    const { data } = await Client.post<AuthResponseDto>("/Auth/register", {
      username: dto.username.trim(),
      password: dto.password,
      asAdmin: !!dto.asAdmin,
    });
    return data;
  },

  async login(dto: LoginRequestDto) {
    const { data } = await Client.post<AuthResponseDto>("/Auth/login", {
      username: dto.username.trim(),
      password: dto.password,
    });

    if (data?.token) {
      setAuthToken(data.token);
    }
    if (typeof data?.isAdmin === "boolean") {
      localStorage.setItem("isAdmin", String(data.isAdmin));
    }
    return data;
  },

  logout() {
    setAuthToken(undefined);
    localStorage.removeItem("isAdmin");
  },
};
