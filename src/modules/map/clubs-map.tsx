import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
import React, { useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { RenderPoints } from './ui/render-points/render-points';
import { PointToClubCreation } from './ui/set-point';
import { useGetClubs } from '@/src/shared/api/api-hooks/use-get-clubs';
import { ClubDto, ClubsFilterParams } from '@/src/services/clubs.service';

// Токен Mapbox
const accessToken =
  'pk.eyJ1IjoiZmlsdmVyZW0iLCJhIjoiY21pZnV0eHhyMDA2MzNkc2JidG14a2owZCJ9.S9HJfTpQplELnjXr4a7IwA';
Mapbox.setAccessToken(accessToken);


interface ClubsMapProps {
  onClubPress: (club: ClubDto) => void;
  selectedPoint: GeoJSON.Feature | null;
  setSelectedPoint: (point: GeoJSON.Feature | null) => void;
}

export const ClubsMap: React.FC<ClubsMapProps> = ({ onClubPress, selectedPoint, setSelectedPoint }) => {
  const cameraRef = useRef<any>(null);

  const clubFilters = useMemo<ClubsFilterParams>(() => {
    const filters: ClubsFilterParams = { page: 1, limit: 10 };
    return filters;
  }, []);

  const { data: clubsResponse, isLoading: isClubsLoading } = useGetClubs(clubFilters);

  if (isClubsLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const clubs = clubsResponse?.data ?? [];

  return (
    <MapView
      style={styles.map}
      compassEnabled={false}
      logoEnabled={false}
      scaleBarEnabled={false}
      onPress={(feature: GeoJSON.Feature) => {
        setSelectedPoint(feature);
      }}
      styleURL="mapbox://styles/mapbox/outdoors-v12"
    >
      <Camera
        ref={cameraRef}
        centerCoordinate={[30.3159, 59.9343]}
        zoomLevel={11}
        animationMode="flyTo"
        animationDuration={1000}
      />

      <RenderPoints clubs={clubs} onClubPress={onClubPress} />

      {selectedPoint && <PointToClubCreation point={selectedPoint} />}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

