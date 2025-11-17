import { ClubDto } from '@/src/services/clubs.service';
import { NearbyClub, PopularClub } from '../../types';

/**
 * Форматирует цену для отображения
 */
export function formatClubPrice(value?: number | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return 'Цена по запросу';
  }

  const rounded = Math.round(value);
  return `от ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`;
}

/**
 * Получает значение цены клуба (приоритет: месяц > день > год)
 */
export function getClubPriceValue(club: ClubDto): number | null {
  if (club.pricePerMonth !== undefined && club.pricePerMonth !== null) {
    return club.pricePerMonth;
  }
  if (club.pricePerDay !== undefined && club.pricePerDay !== null) {
    return club.pricePerDay;
  }
  if (club.pricePerYear !== undefined && club.pricePerYear !== null) {
    return club.pricePerYear;
  }
  return null;
}

/**
 * Нормализует адрес клуба
 */
export function normalizeClubAddress(value?: string | null): string {
  if (!value) {
    return 'Адрес не указан';
  }
  return value.trim();
}

/**
 * Вычисляет занятые места в клубе
 */
export function calculateOccupiedSeats(club: ClubDto): number {
  const totalSpots = club.totalSpots ?? 0;
  const availableSpots = club.availableSpots ?? 0;
  return Math.max(totalSpots - availableSpots, 0);
}

/**
 * Преобразует ClubDto в NearbyClub
 */
export function mapClubToNearby(club: ClubDto): NearbyClub {
  const totalSpots = club.totalSpots ?? 0;
  const occupiedSeats = calculateOccupiedSeats(club);

  return {
    id: club.id,
    name: club.name,
    address: normalizeClubAddress(club.address),
    priceFrom: formatClubPrice(getClubPriceValue(club)),
    occupiedSeats,
    totalSeats: totalSpots || occupiedSeats,
  };
}

/**
 * Преобразует ClubDto в PopularClub
 */
export function mapClubToPopular(club: ClubDto): PopularClub {
  const totalSpots = club.totalSpots ?? 0;
  const occupiedSeats = calculateOccupiedSeats(club);

  return {
    id: club.id,
    name: club.name,
    address: normalizeClubAddress(club.address),
    priceFrom: formatClubPrice(getClubPriceValue(club)),
    occupiedSeats,
    totalSeats: totalSpots || occupiedSeats,
  };
}

/**
 * Сортирует клубы по цене (от дешевых к дорогим)
 */
export function sortClubsByPriceAsc(a: NearbyClub, b: NearbyClub): number {
  const priceA = parseFloat(a.priceFrom.replace(/\D/g, '')) || 0;
  const priceB = parseFloat(b.priceFrom.replace(/\D/g, '')) || 0;
  return priceA - priceB;
}

/**
 * Сортирует клубы по цене (от дорогих к дешевым)
 */
export function sortClubsByPriceDesc(a: NearbyClub, b: NearbyClub): number {
  const priceA = parseFloat(a.priceFrom.replace(/\D/g, '')) || 0;
  const priceB = parseFloat(b.priceFrom.replace(/\D/g, '')) || 0;
  return priceB - priceA;
}


