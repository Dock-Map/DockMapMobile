import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

interface AnchorIconProps extends Omit<XmlProps, "xml"> {
  color?: string;
}

export const AnchorIcon = ({ color = "#071013", ...props }: AnchorIconProps) => (
  <SvgXml
    {...props}
    xml={`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1946_3832)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.1147 1.83009C13.9919 1.82308 14.6987 2.5299 14.6916 3.40704C14.6635 6.88796 13.0858 10.6195 10.9866 14.0397C10.2408 15.2548 8.48535 15.0113 7.99999 13.7322L6.56679 9.95496L2.78967 8.52156C1.51059 8.03622 1.26723 6.28069 2.4822 5.535C5.90236 3.43583 9.63392 1.85793 13.1147 1.83009Z" fill="${color}"/>
</g>
<defs>
<clipPath id="clip0_1946_3832">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>`}
  />
);
