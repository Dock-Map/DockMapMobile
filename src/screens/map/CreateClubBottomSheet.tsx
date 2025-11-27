import { useGetMe } from "@/src/modules/auth/api/use-get-me";
import { CreateClubForm } from "@/src/modules/club/create-club-form";
import { CreateClubFormData } from "@/src/modules/club/create-club-form/model/zod";
import { useCreateClub } from "@/src/shared/api/api-hooks/user-create-club";
import BottomSheetModalBase from "@/src/shared/components/ui/bottom-sheet/BottomSheetModalBase";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet } from "react-native";

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
  const { mutateAsync: createClub } = useCreateClub();
  const { data: user } = useGetMe();
  if (!point) {
    return null;
  }
  if (!user?.id) {
    return null;
  }

  const handleSubmit = (data: CreateClubFormData) => {
    createClub({
      userId: user?.id,
      ...data,
    }).then(() => {
      onClose();
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <BottomSheetModalBase
      ref={sheetRef}
      // snapPoints={['25%', '50%']}
      enableDynamicSizing={true}
      onDismiss={onClose}
      containerStyle={styles.bottomSheetContainer}
    >
      <BottomSheetView style={styles.contentContainer}>
        <CreateClubForm 
          point={point} 
          onSubmit={handleSubmit}
        />
      </BottomSheetView>
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
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 28,
    color: "#1A1A1A",
    marginBottom: 12,
  },
  address: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#5A6E8A",
    marginBottom: 16,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoLabel: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: "#5A6E8A",
  },
  contentContainer: {
    height: 700,
  },
});
