import React from "react";
import { Platform, StyleSheet, Text, TextStyle } from "react-native";
import { ITextProps } from "../../use-theme/types/components";
import useTheme from "../../use-theme/use-theme";
import { ThemeColors } from "../../use-theme/types/theme";

const Typography = (props: ITextProps) => {
    const {
        id = "Text",
        animation,
        duration,
        children,
        style,
        center,
        gradient,
        color,
        opacity,
        size,
        weight,
        font,
        align,
        transform,
        lineHeight,
        position,
        right,
        left,
        top,
        bottom,
        start,
        end,
        marginBottom,
        marginTop,
        marginHorizontal,
        marginVertical,
        marginRight,
        marginLeft,
        paddingBottom,
        paddingTop,
        paddingHorizontal,
        paddingVertical,
        paddingRight,
        paddingLeft,
        ...rest
    } = props;
    const { colors, sizes, lines, weights, fonts } = useTheme();

    const getColor = () => {
        if (props.color && colors[props.color as keyof ThemeColors]) {
            return colors[props.color as keyof ThemeColors];
        }

        const selectedColor = Object.keys(colors).find(
            (key) => props[key as keyof ITextProps],
        );

        return selectedColor
            ? colors[selectedColor as keyof typeof colors]
            : colors.black;
    };

    const textColor = getColor();

    const textStyles = StyleSheet.flatten([
        {

            textAlign: 'left',
            color: colors.black,
            fontSize: sizes.text1,
            lineHeight: lines.text1,
            fontWeight: weights.text1,
            ...(props.h1 && {
                fontSize: sizes.h1,
                lineHeight: lines.h1,
                fontWeight: weights.h1,
                fontFamily: fonts.h1,
            }),
            ...(props.h2 && {
                fontSize: sizes.h2,
                lineHeight: lines.h2,
                fontWeight: weights.h2,
                fontFamily: fonts.h2,
            }),
            ...(props.text1 && {
                fontSize: sizes.text1,
                lineHeight: lines.text1,
                fontWeight: weights.text1,
                fontFamily: fonts.text1,
            }),
            ...(props.text2 && {
                fontSize: sizes.text2,
                lineHeight: lines.text2,
                fontWeight: weights.text2,
                fontFamily: fonts.text2,
            }),
            ...(props.text3 && {
                fontSize: sizes.text3,
                lineHeight: lines.text3,
                fontWeight: weights.text3,
                fontFamily: fonts.text3,
            }),
            ...(props.button && {
                fontSize: sizes.button,
                lineHeight: lines.button,
                fontWeight: weights.button,
                fontFamily: fonts.button,
            }),
            ...(textColor && { color: textColor }),

            ...(marginBottom && { marginBottom }),
            ...(marginTop && { marginTop }),
            ...(marginHorizontal && { marginHorizontal }),
            ...(marginVertical && { marginVertical }),
            ...(marginRight && { marginRight }),
            ...(marginLeft && { marginLeft }),
            ...(paddingBottom && { paddingBottom }),
            ...(paddingTop && { paddingTop }),
            ...(paddingHorizontal && { paddingHorizontal }),
            ...(paddingVertical && { paddingVertical }),
            ...(paddingRight && { paddingRight }),
            ...(paddingLeft && { paddingLeft }),
            ...(center && { textAlign: "center" }),
            ...(align && { textAlign: align }),

            ...(weight && { fontWeight: weight }),
            ...(transform && { textTransform: transform }),
            ...(font && { fontFamily: font }),
            ...(size && { fontSize: size }),
            ...(color && { color }),
            ...(opacity && { opacity }),
            ...(lineHeight && { lineHeight }),
            ...(position && { position }),
            ...(right !== undefined && { right }),
            ...(left !== undefined && { left }),
            ...(top !== undefined && { top }),
            ...(bottom !== undefined && { bottom }),
        },
        style,
    ]) as TextStyle;

    /*
     * Calculate gradient height container based on text lineHeight or fontSize
     * add an extra value from marginVertical or marginTop or marginBottom
     */
    const gradientHeight =
        Number(textStyles?.lineHeight || textStyles?.fontSize || 0) +
        Number(
            textStyles?.marginVertical ||
            textStyles?.marginTop ||
            textStyles?.marginBottom ||
            0,
        );

    // generate component testID or accessibilityLabel based on Platform.OS
    const textID =
        Platform.OS === "android" ? { accessibilityLabel: id } : { testID: id };

    return (
        <Text {...textID} style={textStyles} allowFontScaling={false} {...rest}>
            {children}
        </Text>
    );
};

export default React.memo(Typography);
