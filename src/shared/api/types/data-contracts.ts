import { ApiRequest } from "./native-types-api";

export enum UserRole {
  OWNER = 'owner', // Судовладелец
  CLUB_ADMIN = 'club_admin', // Администратор яхт-клуба
  MANAGER = 'manager', // Менеджер клуба
  WORKER = 'worker', // Швартовщик
  SUPER_ADMIN = 'super_admin', // DockMap модератор платформы
}


export enum AuthProvider {
  SMS = 'sms',
  TELEGRAM = 'telegram',
  VK = 'vk',
  EMAIL = 'email',
}

export type IUserDto = {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email: string;
  cityId: number;
  telegramChatId: string;
  authProvider: AuthProvider;
  providerId: string;
  telegramUsername: string;
  vkId: string;
  isPhoneVerified: boolean;
  refreshTokenHash?: string;
  lastLoginIp: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
};


export type RegisterEmailDto = {
  name: string;
  email: string;
  password: string;
}

export type LoginEmailDto = {
  email: string;
  password: string;
}

export type RegisterResponseDto = {
  accessToken: string;
  refreshToken: string;
  user: IUserDto;
}

// Сброс пароля
export type ResetPasswordRequestDto = {
  email: string;
};

export type ResetPasswordRequestResponseDto = {
  success: boolean;
  message?: string;
};

export type VerifyResetCodeDto = {
  email: string;
  code: string;
};

export type VerifyResetCodeResponseDto = {
  success: boolean;
  message?: string;
};

export type ResetPasswordDto = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export type ResetPasswordResponseDto = {
  success: boolean;
  message?: string;
};

export type ResetPasswordRequestApiRequest = {
  url: string;
  body: ResetPasswordRequestDto;
};

export type VerifyResetCodeApiRequest = {
  url: string;
  body: VerifyResetCodeDto;
};

export type ResetPasswordApiRequest = {
  url: string;
  body: ResetPasswordDto;
};

// Завершение регистрации
export type CompleteRegistrationDto = {
  cityId: number;
  role: 'owner';
};

export type CompleteRegistrationResponseDto = {
  success: boolean;
  message?: string;
};

export type CompleteRegistrationApiRequest = {
  url: string;
  body: CompleteRegistrationDto;
};

// Города
export type CityDto = {
  id: number;
  name: string;
  region: string;
};

export type GetCitiesResponseDto = CityDto[];

export type GetCitiesApiRequest = {
  url: string;
};

export type ClubOwnerDto = {
  id: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  role?: string | null;
  telegramUsername?: string | null;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TariffDto = {
  id: string;
  unit: string;
  pricePerUnit: number;
  clubId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ServiceDto = {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: string;
  clubId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTariffNestedDto = {
  unit: string;
  pricePerUnit: number;
};

export type CreateServiceNestedDto = {
  name: string;
  pricePerUnit: number;
  unit: string;
};

export type ClubDto = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string | null;
  pricePerMonth?: number | null;
  pricePerYear?: number | null;
  pricePerDay?: number | null;
  shipType?: string[] | null;
  parkingLocations?: string[] | null;
  description?: string | null;
  imageUrl?: string | null;
  totalSpots?: number | null;
  availableSpots?: number | null;
  features?: string[] | null;
  latitude?: string | null;
  longitude?: string | null;
  userId: string;
  owner?: ClubOwnerDto | null;
  tariffs?: TariffDto[] | null;
  services?: ServiceDto[] | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ClubsFilterParamsDto = {
  searchString?: string;
  pricePerMonthMin?: number;
  pricePerMonthMax?: number;
  parkingLocations?: string[];
  shipTypes?: string[];
  features?: string[];
  page?: number;
  limit?: number;
};

export type GetClubsResponseDto = {
  data: ClubDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GetClubsApiRequest = ApiRequest<
  "CLUBS.ROOT",
  never,
  never,
  GetClubsResponseDto
>;


export type CreateClubDto = {
  userId: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  imageUrl?: string;
  totalSpots?: number;
  availableSpots?: number;
  features?: string[];
  latitude?: number;
  longitude?: number;
  tariffs?: CreateTariffNestedDto[];
  services?: CreateServiceNestedDto[];
};