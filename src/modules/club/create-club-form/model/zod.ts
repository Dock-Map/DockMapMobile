import { z } from "zod";

// Схема для тарифа
const tariffSchema = z.object({
  unit: z.string().min(1, "Единица измерения обязательна"),
  pricePerUnit: z.number().min(0, "Цена должна быть положительной"),
});

// Схема для сервиса
const serviceSchema = z.object({
  name: z.string().min(1, "Название сервиса обязательно"),
  pricePerUnit: z.number().min(0, "Цена должна быть положительной"),
  unit: z.string().min(1, "Единица измерения обязательна"),
});

// Основная схема формы создания клуба
export const createClubFormSchema = z.object({
  name: z.string().min(1, "Название клуба обязательно"),
  address: z.string().min(1, "Адрес клуба обязательно"),
  phone: z.string().min(1, "Телефон клуба обязателен"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  totalSpots: z.number().min(0, "Количество мест должно быть положительным").optional(),
  availableSpots: z.number().min(0, "Доступные места должны быть положительными").optional(),
  features: z.array(z.string()).optional(),
  tariffs: z.array(tariffSchema).optional(),
  services: z.array(serviceSchema).optional(),
});

export type CreateClubFormData = z.infer<typeof createClubFormSchema>;