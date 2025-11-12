import React, { forwardRef, useCallback } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import type { ViewStyle } from "react-native";

type BottomSheetModalBaseProps = Omit<BottomSheetModalProps, "children"> & {
  contentStyle?: ViewStyle;
  children: React.ReactNode;
};

const BottomSheetModalBase = forwardRef<BottomSheetModal, BottomSheetModalBaseProps>(
  (
    {
      children,
      contentStyle,
      backdropComponent,
      enablePanDownToClose = true,
      enableDynamicSizing = true,
      ...rest
    },
    ref,
  ) => {
    const defaultBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        enablePanDownToClose={enablePanDownToClose}
        enableDynamicSizing={enableDynamicSizing}
        backdropComponent={backdropComponent ?? defaultBackdrop}
        {...rest}
      >
        <BottomSheetView style={contentStyle}>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  },
);

BottomSheetModalBase.displayName = "BottomSheetModalBase";

export default BottomSheetModalBase;
