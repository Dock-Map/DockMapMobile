import { useGetClubById } from "@/src/shared/api/api-hooks/use-get-club-by-id";
import { ArrowBackIcon } from "@/src/shared/components/icons";
import { Camera, MapView, MarkerView } from "@rnmapbox/maps";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const PierMapScreen = () => {
  const params = useLocalSearchParams<{ clubId?: string }>();
  const clubId = params.clubId;
  const { data: club } = useGetClubById(clubId);

  console.log(club, "club");
  if (!club) {
    return (
      <SafeAreaView>
        <Text>Club not found</Text>
      </SafeAreaView>
    );
  }

  const longitude = parseFloat(club.longitude || "0");
  const latitude = parseFloat(club.latitude || "0");

  if (isNaN(longitude) || isNaN(latitude)) {
    return (
      <SafeAreaView>
        <Text>Invalid coordinates</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowBackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Карта швартовок</Text>
      </View>
      <MapView
        style={styles.map}
        compassEnabled={false}
        logoEnabled={false}
        scaleBarEnabled={false}
        gestureSettings={{
          doubleTapToZoomInEnabled: false,
          doubleTouchToZoomOutEnabled: false,
          pinchPanEnabled: false,
          pinchZoomEnabled: false,
          pinchZoomDecelerationEnabled: false,
          pitchEnabled: false,
          quickZoomEnabled: false,
          rotateEnabled: false,
          rotateDecelerationEnabled: false,
          panEnabled: false,
          panDecelerationFactor: 0,
          simultaneousRotateAndPinchZoomEnabled: false,
        }}
        onPress={(event) => {
          console.log(event, "event");
        }}
        styleURL="mapbox://styles/mapbox/outdoors-v12"
      >
        <Camera
          centerCoordinate={[longitude, latitude]}
          zoomLevel={17}
          animationMode="flyTo"
          animationDuration={1000}
        />
        <MarkerView coordinate={[longitude, latitude]}>
          <View style={styles.marker}></View>
        </MarkerView>
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#0084FF",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
});
