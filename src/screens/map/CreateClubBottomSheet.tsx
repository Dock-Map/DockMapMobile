import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheetModalBase from '@/src/shared/components/ui/bottom-sheet/BottomSheetModalBase';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

interface CreateClubBottomSheetProps {
  onClose: () => void;
  sheetRef: React.RefObject<BottomSheetModal | null>;
  point: GeoJSON.Feature | null;
}

export const CreateClubBottomSheet: React.FC<CreateClubBottomSheetProps> = ({
  onClose,
  sheetRef,
  point,
}) => {
  if (!point) {
    return null;
  }

  return (
    <BottomSheetModalBase
      ref={sheetRef}
      enableDynamicSizing
      snapPoints={['25%', '50%']}
      onDismiss={onClose}
      containerStyle={styles.bottomSheetContainer}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Создание клуба</Text>
        <Text style={styles.address}>{point.geometry?.coordinates.join(', ')}</Text>
        <Text style={styles.address}>{point.properties?.description}</Text>
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

