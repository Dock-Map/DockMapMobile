import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheetModalBase from '@/src/shared/components/ui/bottom-sheet/BottomSheetModalBase';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Club } from '@/src/modules/map/clubs-map';

interface ClubBottomSheetProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  club: Club | null;
}

export const ClubBottomSheet: React.FC<ClubBottomSheetProps> = ({
  sheetRef,
  club,
}) => {
  if (!club) {
    return null;
  }

  return (
    <BottomSheetModalBase
      ref={sheetRef}
      enableDynamicSizing
      snapPoints={['25%', '50%']}
      containerStyle={styles.bottomSheetContainer}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{club.name}</Text>
        <Text style={styles.address}>{club.address}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Координаты:</Text>
          <Text style={styles.infoValue}>
            {club.lat.toFixed(4)}, {club.lon.toFixed(4)}
          </Text>
        </View>
      </View>
    </BottomSheetModalBase>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    zIndex: 1000,
    elevation: 1000,
  },
  container: {
    padding: 20,
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  address: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#5A6E8A',
    marginBottom: 16,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoLabel: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6E8A',
  },
});

