import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ClubsMap } from "@/src/modules/map/clubs-map";
import { ClubBottomSheet } from "./ClubBottomSheet";
import { CreateClubBottomSheet } from "./CreateClubBottomSheet";
import { ClubDto } from "@/src/services/clubs.service";

const ClubsMapScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedClub, setSelectedClub] = React.useState<ClubDto | null>(null);
  const [selectedPoint, setSelectedPoint] =
    React.useState<GeoJSON.Feature | null>(null);
  const createClubBottomSheetRef = useRef<BottomSheetModal>(null);


  useEffect(() => {
    if (selectedPoint) {
      createClubBottomSheetRef.current?.present();
    }
  }, [selectedPoint]);


  const handleClubPress = useCallback((club: ClubDto) => {
    setSelectedClub(club);
    bottomSheetRef.current?.present();
  }, []);

  const setHandleSetMapPoint = useCallback((point: GeoJSON.Feature | null) => {
    if (!point) {
      return;
    }
    setSelectedPoint(point);
  }, []);

  const onCloseCreateClubBottomSheet = useCallback(() => {
    createClubBottomSheetRef.current?.dismiss();
    setSelectedPoint(null);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ClubsMap
        onClubPress={handleClubPress}
        selectedPoint={selectedPoint}
        setSelectedPoint={setHandleSetMapPoint}
      />
      <ClubBottomSheet sheetRef={bottomSheetRef} club={selectedClub} />
      <CreateClubBottomSheet onClose={onCloseCreateClubBottomSheet} sheetRef={createClubBottomSheetRef} point={selectedPoint} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFCFE",
  },
});

export default ClubsMapScreen;
