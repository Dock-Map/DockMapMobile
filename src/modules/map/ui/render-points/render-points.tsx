import {
  CircleLayer,
  Images,
  Image,
  ShapeSource,
  SymbolLayer,
} from "@rnmapbox/maps";
import { featureCollection, point } from "@turf/helpers";
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { Club } from "../../clubs-map";

interface IRenderPoints {
  clubs: Club[];
  onClubPress?: (club: Club) => void;
}

export const RenderPoints: React.FC<IRenderPoints> = ({
  clubs,
  onClubPress,
}) => {
  const clubPoints = useMemo(
    () =>
      clubs.map((club) =>
        point([club.lon, club.lat], {
          club,
          priceText: club.priceFrom
            ? `от ${Math.round(club.priceFrom)} ₽`
            : "Цена по запросу",
        }),
      ),
    [clubs],
  );
  const generalClubsFeatures = featureCollection(clubPoints);

  const handleOpen = (clubId: string) => {
    if (onClubPress) {
      const club = clubs.find((c) => c.id === clubId);
      if (club) {
        onClubPress(club);
      }
    }
    console.log(clubId, "clubId");
  };

  const onPointerPress = async (event: any) => {
    const feature = event.features?.[0];
    if (!feature) return;

    const isCluster = feature.properties?.cluster;
    const clubId = feature.properties?.club?.id;

    if (isCluster && !clubId) {
      // Клик по кластеру - можно добавить логику разворачивания
      return;
    }

    if (clubId) {
      handleOpen(clubId);
    }
  };

  return (
    <>
      {/* Кластеры для группировки точек */}
      <ShapeSource
        id="general_club"
        cluster
        clusterRadius={50}
        clusterMaxZoomLevel={14}
        shape={generalClubsFeatures}
        onPress={onPointerPress}
      >
        <CircleLayer
          filter={["has", "cluster"]}
          id="cluster"
          slot="middle"
          style={{
            circlePitchAlignment: "map",
            circleColor: "#0084FF",
            circleRadius: 20,
            circleStrokeWidth: 2,
            circleStrokeColor: "white",
          }}
        />
        <SymbolLayer
          id="cluster-count"
          aboveLayerID="cluster"
          filter={["has", "cluster"]}
          style={{
            textField: ["get", "point_count"],
            textColor: "#fff",
            textFont: ["Arial Unicode MS Bold"],
          }}
        />

        {/* Точка (маркер) для некластеризованных точек */}
        <CircleLayer
          id="price-point"
          filter={["!", ["has", "cluster"]]}
          style={{
            circleRadius: 6,
            circleColor: "#00C4CC",
            circlePitchAlignment: "map",
            circleStrokeWidth: 2,
            circleStrokeColor: "#FFFFFF",
          }}
        />

        {/* Изображение ценника (фон) */}
        <Images>
          <Image name="priceBubble">
            <View style={styles.bubbleContainer}>
              <View style={styles.bubble} />
            </View>
          </Image>
        </Images>

        {/* Слой для отображения фона ценника */}
        <SymbolLayer
          id="price-bubble-bg"
          filter={["!", ["has", "cluster"]]}
          style={{
            iconImage: "priceBubble",
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            iconSize: 1,
            iconAnchor: "bottom",
            iconOffset: [0, -18], // Сдвигаем ценник выше точки (точка 6px радиус + 2px обводка = 10px, + отступ 12px)
          }}
        />

        {/* Слой для отображения динамической цены */}
        <SymbolLayer
          id="price-text"
          filter={["!", ["has", "cluster"]]}
          aboveLayerID="price-bubble-bg"
          style={{
            textField: ["get", "priceText"],
            textColor: "#1A1A1A",
            textFont: ["Arial Unicode MS Regular"],
            textSize: 14,
            textAllowOverlap: true,
            textIgnorePlacement: true,
            textAnchor: "center",
            textOffset: [0, -2], // Тот же offset, чтобы текст был точно по центру ценника
          }}
        />
      </ShapeSource>
    </>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 100, // Фиксированная ширина для лучшего позиционирования
    height: 30, // Фиксированная высота
  },
  bubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 80,
    height: 24, // Фиксированная высота для точного позиционирования
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
