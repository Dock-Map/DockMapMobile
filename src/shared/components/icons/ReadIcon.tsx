import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const ReadIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.5 10.8387L5.44636 14.2137L12.8122 5.77637" stroke="#071013" stroke-width="1.79995" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.5 5.83496L9.46427 14.2722L9.06274 13.7449" stroke="#071013" stroke-width="1.79995" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`}
    />
  );
};
