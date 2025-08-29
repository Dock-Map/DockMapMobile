import { THEME as commonTheme } from "./theme";
import { ITheme, ThemeColors, ThemeGradients, ThemeSizes, ThemeSpacing, } from "./types/theme";

export const COLORS: ThemeColors = {
    // Neutral colors
    white: '#FFFFFF',
    black: '#1A1A1A',
    background: '#FAFCFE',
    grey100: '#EFF3F8',
    grey200: '#EAF0F6',
    grey400: '#C8D2E5',
    grey500: '#A1B0CA',
    grey700: '#7D8EAA',
    grey900: '#5A6E8A',
    
    // Primary colors
    primary100: '#C0EDFF',
    primary500: '#19A7E9',
    primary500_12: 'rgba(25, 167, 233, 0.12)',
    primary600: '#008FD2',
    
    // Accent colors
    accent500: '#15CDCA',
    accent500_12: 'rgba(21, 205, 202, 0.12)',
    
    // Palette colors
    red: '#F53F3F',
};

export const GRADIENTS: ThemeGradients = {
    /* primary: ["#FF0080", "#7928CA"],
     secondary: ["#A8B8D8", "#627594"],
     info: ["#21D4FD", "#2152FF"],
     success: ["#98EC2D", "#17AD37"],
     warning: ["#FBCF33", "#F53939"],
     danger: ["#FF667C", "#EA0606"],

     light: ["#EBEFF4", "#CED4DA"],
     dark: ["#3A416F", "#141727"],

   /!*  white: [String(COLORS.white), "#EBEFF4"],
     black: [String(COLORS.black), "#141727"],*!/

     divider: ["rgba(255,255,255,0.3)", "rgba(102, 116, 142, 0.6)"],
     menu: [
       "rgba(255, 255, 255, 0.2)",
       "rgba(112, 125, 149, 0.5)",
       "rgba(255, 255, 255, 0.2)",
     ],*/
};

export const SIZES: ThemeSizes = {
    // global sizes
    base: 8,
    padding20: 20,
    padding10: 10,
    padding5: 5,

    // fonts sizes from Figma design tokens
    h1: 24, // Heading 1
    h2: 20, // Heading 2
    text1: 18, // Heading 3
    text2: 16, // Body M
    text3: 14, // Body S
    button: 16, // Button

    // button sizes
    buttonBorder: 1,
    buttonRadius: 8,

    // button shadow
    shadowOffsetWidth: 0,
    shadowOffsetHeight: 7,
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,

    // input sizes
    inputHeight: 46,
    inputBorder: 1,
    inputRadius: 8,
    inputPadding: 12,
};

export const SPACING: ThemeSpacing = {
    /** xs: 4px */
    xs: SIZES.base * 0.5,
    /** s: 8px */
    s: SIZES.base * 1,
    /** sm: 16px */
    sm: SIZES.base * 2,
    /** m: 24px */
    m: SIZES.base * 3,
    /** md: 32px */
    md: SIZES.base * 4,
    /** l: 40px */
    l: SIZES.base * 5,
    /** xl: 48px */
    xl: SIZES.base * 6,
    /** xxl: 56px */
    xxl: SIZES.base * 7,
};

export const LIGHT: ITheme = {
    ...commonTheme,
    colors: COLORS,
    gradients: GRADIENTS,
    sizes: {...SIZES, ...commonTheme.sizes, ...SPACING},
};
