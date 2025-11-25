import BottomSheetModalBase from "@/src/shared/components/ui/bottom-sheet/BottomSheetModalBase";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { ClusteredYamap, Marker } from "react-native-yamap";
import { ShipIcon } from "@/src/shared/components/icons/map/ShipIcon";

interface TestPoint {
  id: number;
  name: string;
  lat: number;
  lon: number;
  description?: string;
}

// Выносим TEST_POINTS за пределы компонента, чтобы избежать пересоздания
const TEST_POINTS: TestPoint[] = [
  {
    id: 1,
    name: "Красная площадь",
    lat: 55.7558,
    lon: 37.6173,
    description: "Главная площадь Москвы, расположенная в центре города",
  },
  {
    id: 2,
    name: "Московский Кремль",
    lat: 55.7520,
    lon: 37.6175,
    description: "Исторический комплекс в центре Москвы",
  },
  {
    id: 3,
    name: "Большой театр",
    lat: 55.7596,
    lon: 37.6184,
    description: "Один из крупнейших в России и один из самых значительных в мире театров оперы и балета",
  },
  {
    id: 4,
    name: "Третьяковская галерея",
    lat: 55.7415,
    lon: 37.6208,
    description: "Художественный музей в Москве, основанный в 1856 году",
  },
  {
    id: 5,
    name: "Парк Горького",
    lat: 55.7320,
    lon: 37.6014,
    description: "Центральный парк культуры и отдыха имени Максима Горького",
  },
];

const MapScreen: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<TestPoint | null>(null);
  
  const { width, height } = useWindowDimensions();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleMarkerPress = useCallback((point: TestPoint) => {
    setSelectedPoint(point);
    bottomSheetRef.current?.present();
  }, []);

  // Мемоизируем массив маркеров для предотвращения пересоздания объектов
  // Это критически важно - массив должен быть стабильным, иначе SDK будет пытаться
  // удалять и пересоздавать маркеры, что вызывает ошибку "Failed to remove MapObject"
  const clusteredMarkers = useMemo(
    () =>
      TEST_POINTS.map((point) => ({
        point: { lat: point.lat, lon: point.lon },
        data: point,
      })),
    []
  );

  // Кастомный стиль карты, скрывающий POI (кафе, остановки и т.д.), оставляя только улицы
  // Формат согласно документации: https://yandex.ru/maps-api/docs/mapkit/style.html
  // Мемоизируем стиль карты, чтобы не пересоздавать его при каждом рендере
  const mapStyle = useMemo(() => JSON.stringify([
    // Скрываем все точки интереса (POI)
    {
      types: "point",
      tags: {
        all: ["poi"],
      },
      stylers: {
        visibility: "off",
      },
    },
    // Скрываем остановки общественного транспорта
    {
      types: "point",
      tags: {
        all: ["transit_location"],
      },
      stylers: {
        visibility: "off",
      },
    },
    // Скрываем остановки наземного транспорта
    {
      types: "point",
      tags: {
        all: ["transit_stop"],
      },
      stylers: {
        visibility: "off",
      },
    },
    // Скрываем входы в метро
    {
      types: "point",
      tags: {
        all: ["transit_entrance"],
      },
      stylers: {
        visibility: "off",
      },
    },
    // Скрываем парковки
    {
      types: "point",
      tags: {
        all: ["parking"],
      },
      stylers: {
        visibility: "off",
      },
    },
    // Скрываем заправочные станции
    {
      types: "point",
      tags: {
        all: ["fuel_station"],
      },
      stylers: {
        visibility: "off",
      },
    },
    // Скрываем рестораны и бары
    {
      types: "point",
      tags: {
        all: ["food_and_drink"],
      },
      stylers: {
        visibility: "off",
      },
    },
    // Скрываем магазины
    {
      types: "point",
      tags: {
        all: ["shopping"],
      },
      stylers: {
        visibility: "off",
      },
    },
  ]), []);

  const markerChild = useMemo(
    () => <ShipIcon width={50} height={50} />,
    []
  );
  const renderMarker = useCallback((info: { point: { lat: number; lon: number }; data: any }, index: number) => {
    const pointData = info.data as TestPoint;
    return (
      <Marker
        point={info.point}
        onPress={() => handleMarkerPress(pointData)}
        zIndex={1}
      >
        {markerChild}
      </Marker>
    );
  }, [handleMarkerPress, markerChild]);

  return (
    <View style={styles.container}>
      <ClusteredYamap
        key="map"
        initialRegion={{
          lat: 55.7558,
          lon: 37.6173,
          zoom: 10,
          azimuth: 0,
          tilt: 0,
        }}
        style={[styles.map, { width: width, height: height }]}
        mapStyle={mapStyle}
        clusterColor="#007AFF"
        clusteredMarkers={clusteredMarkers}
        renderMarker={renderMarker}
        onMapLoaded={(event) => {
          console.log('Карта загружена:', event.nativeEvent);
        }}
        onCameraPositionChange={(event) => {
          console.log('Позиция камеры изменена:', event.nativeEvent);
        }}
      />

      <BottomSheetModalBase
        ref={bottomSheetRef}
        enableDynamicSizing
        contentStyle={styles.bottomSheetContent}
        onDismiss={() => {
          // Очищаем selectedPoint после закрытия bottom sheet
          // Не используем задержку, так как onDismiss уже вызывается после завершения анимации
          setSelectedPoint(null);
        }}
      >
        {selectedPoint && (
          <View style={styles.markerInfo}>
            <Text style={styles.markerTitle}>{selectedPoint.name}</Text>
            {selectedPoint.description && (
              <Text style={styles.markerDescription}>{selectedPoint.description}</Text>
            )}
            <Text style={styles.markerCoordinates}>
              Координаты: {selectedPoint.lat.toFixed(4)}, {selectedPoint.lon.toFixed(4)}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => bottomSheetRef.current?.dismiss()}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        )}
      </BottomSheetModalBase>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
  bottomSheetContent: {
    padding: 20,
  },
  markerInfo: {
    gap: 12,
  },
  markerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  markerDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  markerCoordinates: {
    fontSize: 14,
    color: "#999",
    fontFamily: "monospace",
  },
  closeButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  markerStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "red",
  },
});

export default MapScreen;
