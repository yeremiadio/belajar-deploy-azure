import { SVGProps } from 'react';

export const IconFrequency = (
  props: SVGProps<SVGSVGElement> & { size?: number; color?: string },
) => (
  <svg
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 50 50"
    fill={props.color || 'currentColor'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M11 9a1 1 0 00-1 1v16h2V10a1 1 0 00-1-1zm-4 3a1 1 0 00-1 1v13h2V13a1 1 0 00-1-1zm8 0a1 1 0 00-1 1v13h2V13a1 1 0 00-1-1zM3 17a1 1 0 00-1 1v8h2v-8a1 1 0 00-1-1zm16 0a1 1 0 00-1 1v8h2v-8a1 1 0 00-1-1zm4 5a1 1 0 00-1 1v3h2v-3a1 1 0 00-1-1zm3 5v3a1 1 0 001 1 1 1 0 001-1v-3h-2zm4 0v8a1 1 0 001 1 1 1 0 001-1v-8h-2zm4 0v14a1 1 0 001 1 1 1 0 001-1V27h-2zm4 0v16a1 1 0 001 1 1 1 0 001-1V27h-2zm4 0v14a1 1 0 001 1 1 1 0 001-1V27h-2zm4 0v8a1 1 0 001 1 1 1 0 001-1v-8h-2z"></path>
  </svg>
);
