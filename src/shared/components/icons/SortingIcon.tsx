import React from 'react';
import { SvgXml, XmlProps } from 'react-native-svg';

interface SortingIconProps extends Omit<XmlProps, 'xml'> {
  color?: string;
}

export const SortingIcon = ({ color = '#071013', ...props }: SortingIconProps) => (
  <SvgXml
    {...props}
    xml={`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.5 4.5L8 1L13.5 4.5M2.5 11.5L8 15L13.5 11.5M8 1V15" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`}
  />
);

