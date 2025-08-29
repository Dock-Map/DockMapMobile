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