import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { RenderPoints } from './ui/render-points/render-points';

// Токен Mapbox
const accessToken =
  'pk.eyJ1IjoiZmlsdmVyZW0iLCJhIjoiY21pZnV0eHhyMDA2MzNkc2JidG14a2owZCJ9.S9HJfTpQplELnjXr4a7IwA';
Mapbox.setAccessToken(accessToken);

export interface Club {
  id: string;
  name: string;
  address: string;
  lon: number;
  lat: number;
  priceFrom?: number;
}

interface ClubsMapProps {
  onClubPress: (club: Club) => void;
}

// Моковые данные клубов по Москве
const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Яхт-клуб "Северный"',
    address: 'Москва, Ленинградское шоссе, 57',
    lon: 37.4567,
    lat: 55.8567,
    priceFrom: 500,
  },
  {
    id: '2',
    name: 'Марина "Рублевка"',
    address: 'Москва, Рублевское шоссе, 20',
    lon: 37.3667,
    lat: 55.7367,
    priceFrom: 800,
  },
  {
    id: '3',
    name: 'Порт "Коломенское"',
    address: 'Москва, проспект Андропова, 39',
    lon: 37.6667,
    lat: 55.6667,
    priceFrom: 600,
  },
  {
    id: '4',
    name: 'Яхт-клуб "Строгино"',
    address: 'Москва, Строгинское шоссе, 1',
    lon: 37.4000,
    lat: 55.8000,
    priceFrom: 750,
  },
  {
    id: '5',
    name: 'Марина "Химки"',
    address: 'Москва, Ленинградское шоссе, 1',
    lon: 37.4333,
    lat: 55.8833,
    priceFrom: 900,
  },
];

export const ClubsMap: React.FC<ClubsMapProps> = ({ onClubPress }) => {
  const cameraRef = useRef<any>(null);

  return (
    <MapView
      style={styles.map}
      compassEnabled={false}
      logoEnabled={false}
      scaleBarEnabled={false}
      styleURL="mapbox://styles/mapbox/light-v11"
    >
      <Camera
        ref={cameraRef}
        centerCoordinate={[37.6173, 55.7558]} // Центр Москвы
        zoomLevel={11}
        animationMode="flyTo"
        animationDuration={1000}
      />

      <RenderPoints clubs={mockClubs} onClubPress={onClubPress} />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

