import {
  UserLocation,
  Images,
  CircleLayer,
  SymbolLayer,
  Image,
} from "@rnmapbox/maps";
import React from "react";
import { View } from "react-native";

export const UserPuck = () => {
  return (
    <UserLocation androidRenderMode="gps" visible animated>
      <Images>
        <Image name="labelImage">
          <View
            style={{
              width: 25,
              height: 15,
              borderRadius: 8,
              backgroundColor: "#0084FF",
            }}
          />
        </Image>
      </Images>
      <CircleLayer
        key="mapboxUserLocationPluseCircle"
        id="mapboxUserLocationPluseCircle"
        style={{
          circleRadius: 16,
          circleColor: "#0084FF",
          circlePitchAlignment: "map",
        }}
      />
      <CircleLayer
        key="mapboxUserLocationWhiteCircle"
        id="mapboxUserLocationWhiteCircle"
        aboveLayerID="mapboxUserLocationPluseCircle"
        style={{
          circleRadius: 8,
          circleColor: "#FFFFFF",
          circlePitchAlignment: "map",
        }}
      />
      <SymbolLayer
        id="labelIcon"
        style={{
          iconImage: "labelImage",
          iconAllowOverlap: true,
          iconSize: 1.5,
          iconAnchor: "top",
          iconOffset: [0, 12],
        }}
      />
      <SymbolLayer
        id="label"
        style={{
          textField: "me",
          textColor: "#fff",
          textFont: ["Arial Unicode MS Bold"],
          textOffset: [-0.2, 1.8],
        }}
      />
    </UserLocation>
  );
};
