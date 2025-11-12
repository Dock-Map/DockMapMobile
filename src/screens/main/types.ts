import { ImageSourcePropType } from 'react-native';

export type NearbyClub = {
  id: string;
  name: string;
  address: string;
  priceFrom: string;
  occupiedSeats: number;
  totalSeats: number;
  gradient: [string, string];
  image: ImageSourcePropType;
};

export type PopularClub = {
  id: string;
  name: string;
  address: string;
  priceFrom: string;
  occupiedSeats: number;
  totalSeats: number;
};
