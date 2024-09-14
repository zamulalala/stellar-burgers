import { TUser } from '../../utils/types';

export const mockUser: TUser = {
  email: "ritazamula2001@gmail.com",
  name: "zamulalala"
};

export const mockUserResponse = {
  success: true,
  user: mockUser
};

export const mockLoginData = {
  email: "ritazamula2001@gmail.com",
  password: "testpassword123"
};

export const mockRegisterData = {
  ...mockLoginData,
  name: "zamulalala"
};

export const mockUpdateUserData = {
  name: "newzamulalala",
  email: "newritazamula2001@gmail.com",
  password: "newtestpassword123"
};

export const mockAuthResponse = {
  success: true,
  accessToken: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "b5b8c2c0b6f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4",
  user: mockUser
};

export const mockForgotPasswordData = {
  email: "ritazamula2001@gmail.com"
};

export const mockResetPasswordData = {
  password: "newtestpassword123",
  token: "resetpasswordtoken123"
};
