export type LoginRequestDto = {
  username: string;
  password: string;
};

export type RegisterRequestDto = {
  username: string;
  password: string;
};

export type AuthResponseDto = {
  token: string;
  expiresAtUtc: string;  
  username: string;
  isAdmin: boolean;
  success: boolean;
  message: string;
};


export const parseAuthResponse = (r: AuthResponseDto) => ({
  ...r,
  expiresAtUtc: new Date(r.expiresAtUtc),
});
