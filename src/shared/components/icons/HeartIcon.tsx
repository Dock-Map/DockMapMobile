import React from 'react';
import { SvgXml, XmlProps } from 'react-native-svg';

type HeartIconProps = Omit<XmlProps, 'xml'> & {
  color?: string;
};

const HeartIcon: React.FC<HeartIconProps> = ({ color = '#CDD5DF', ...props }) => (
  <SvgXml
    xml={`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4088_2694)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.7141 5.64724C15.6875 3.83917 14.6638 2.05858 13.0888 1.3247C12.2885 0.951729 11.3603 0.858839 10.3923 1.1661C9.58606 1.42202 8.77856 1.94654 7.99992 2.7712C7.22128 1.94654 6.41379 1.42202 5.60754 1.1661C4.63955 0.858839 3.71134 0.951729 2.91095 1.3247C1.33604 2.05858 0.312434 3.83917 0.285707 5.64724L0.285645 5.65568C0.285645 8.2928 1.85398 10.6291 3.51494 12.2689C4.35337 13.0966 5.2384 13.7703 6.01041 14.2407C6.39618 14.4756 6.76142 14.6647 7.08502 14.7967C7.39416 14.9228 7.7167 15.0187 7.99992 15.0187C8.28314 15.0187 8.60568 14.9228 8.91482 14.7967C9.23842 14.6647 9.60366 14.4756 9.98943 14.2407C10.7615 13.7703 11.6464 13.0966 12.485 12.2689C14.1459 10.6291 15.7142 8.2928 15.7142 5.65568L15.7141 5.64724Z" fill="${color}"/>
</g>
<defs>
<clipPath id="clip0_4088_2694">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>`}
    {...props}
  />
);

export default HeartIcon;
