// import { Client, setAuthToken } from "./Client";
// import type { LoginRequestDto, RegisterRequestDto, AuthResponseDto } from "../Dto/Auth.dto";

// export const AuthClient = {
//   async register(dto: RegisterRequestDto) {
//     const { data } = await Client.post<AuthResponseDto>("/Auth/register", {
//       username: dto.username,
//       password: dto.password,
//     });
//     return data;
//   },

//   async login(dto: LoginRequestDto) {
//     const { data } = await Client.post<AuthResponseDto>("/Auth/login", {
//       username: dto.username,
//       password: dto.password,
//     });

//     if (data?.token) {
//       setAuthToken(data.token);
//     }
//     if (typeof data?.isAdmin === "boolean") {
//       localStorage.setItem("isAdmin", String(data.isAdmin));
//     }
    
//     return data;
//   },

//   logout() {
//     setAuthToken(undefined);
//     localStorage.removeItem("isAdmin");
//   },
// };


import { Client, setAuthToken } from "./Client";
import type { LoginRequestDto, RegisterRequestDto, AuthResponseDto } from "../Dto/Auth.dto";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  [key: string]: unknown;
}

export const AuthClient = {
  async register(dto: RegisterRequestDto) {
    const { data } = await Client.post<AuthResponseDto>("/Auth/register", {
      username: dto.username,
      password: dto.password,
    });
    return data;
  },

  async login(dto: LoginRequestDto) {
    const { data } = await Client.post<AuthResponseDto>("/Auth/login", {
      username: dto.username,
      password: dto.password,
    });

    if (data?.token) {
      setAuthToken(data.token);
      try {
        const decoded = jwtDecode<DecodedToken>(data.token);
        const isAdmin = decoded.role === "Admin";
        localStorage.setItem("isAdmin", String(isAdmin));
      } catch {
        localStorage.removeItem("isAdmin");
      }
    }

    return data;
  },

  logout() {
    setAuthToken(undefined);
    localStorage.removeItem("isAdmin");
  },
};
