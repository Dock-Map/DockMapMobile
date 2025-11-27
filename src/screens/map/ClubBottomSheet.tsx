import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheetModalBase from '@/src/shared/components/ui/bottom-sheet/BottomSheetModalBase';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { ClubDto } from '@/src/shared/api/types/data-contracts';
import { ClubItem } from '@/src/modules/club/club-item';
import { router } from 'expo-router';

interface ClubBottomSheetProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  club: ClubDto | null;
}

export const ClubBottomSheet: React.FC<ClubBottomSheetProps> = ({
  sheetRef,
  club,
}) => {
  if (!club) {
    return null;
  }

  const handleClubPress = (clubId: string) => {
    sheetRef?.current?.dismiss();
    router.push({
      pathname: '/(protected-tabs)/main/details' as any,
      params: { clubId },
    });
  }

  return (
    <BottomSheetModalBase
      ref={sheetRef}
      enableDynamicSizing
      containerStyle={styles.bottomSheetContainer}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ClubItem club={club} onPress={handleClubPress} />
      </BottomSheetView>
    </BottomSheetModalBase>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    zIndex: 1000,
    elevation: 1000,
  },
  contentContainer: {
    paddingHorizontal: 12,
    minHeight: 400,
  },
});

