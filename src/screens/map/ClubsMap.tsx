import React, { useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ClubsMap, Club } from '@/src/modules/map/clubs-map';
import { ClubBottomSheet } from './ClubBottomSheet';

const ClubsMapScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedClub, setSelectedClub] = React.useState<Club | null>(null);

  const handleClubPress = useCallback((club: Club) => {
    setSelectedClub(club);
    bottomSheetRef.current?.present();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ClubsMap onClubPress={handleClubPress} />
      <ClubBottomSheet sheetRef={bottomSheetRef} club={selectedClub} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCFE',
  },
});

export default ClubsMapScreen;

