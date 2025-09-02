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