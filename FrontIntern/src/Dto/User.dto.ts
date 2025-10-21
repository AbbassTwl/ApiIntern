export type UserResponseDto = {
  id: string;       // Guid
  username: string;
  isAdmin: boolean;
};

export type MeResponse = {
  name: string | null;
  isAdmin: boolean;
  accountAdmin: string | null;
};
