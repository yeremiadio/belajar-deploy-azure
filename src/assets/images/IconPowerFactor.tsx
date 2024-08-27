import { SVGProps } from 'react';

export const IconPowerFactor = (
  props: SVGProps<SVGSVGElement> & { size?: number; color?: string },
) => (
  <svg
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 16 16"
    fill={props.color || 'currentColor'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.32812 1.90625H0.75V14.0938H1.32812V8.29688H6.76562L6.52344 7.71875H2.15255C2.16513 7.65739 2.17784 7.59505 2.19075 7.53183C2.36664 6.66995 2.57547 5.64677 2.90792 4.7535C3.11872 4.18714 3.3638 3.71958 3.64808 3.40081C3.92297 3.09256 4.21195 2.94531 4.54417 2.94531C4.56437 2.94531 4.69084 2.96716 4.9262 3.24816C5.14572 3.51023 5.38422 3.90813 5.63991 4.42433C6.0992 5.35161 6.56719 6.56183 7.05673 7.82783L7.05694 7.82837C7.11127 7.96884 7.16584 8.11 7.2207 8.25152C7.76302 9.65045 8.33292 11.0857 8.92905 12.167C9.22656 12.7066 9.54633 13.1878 9.89319 13.5373C10.2351 13.8818 10.6679 14.1619 11.1822 14.1451C12.0086 14.118 12.6362 13.6395 13.0922 13.0499C13.5462 12.4628 13.8743 11.7129 14.111 11.0028C14.3497 10.2868 14.5061 9.57838 14.6028 9.05219C14.6513 8.7882 14.6852 8.56797 14.707 8.41286C14.7132 8.36883 14.7184 8.33 14.7228 8.29688H15.2422V7.71875H8.73438L8.97656 8.29688H13.6977C13.6774 8.43855 13.6468 8.63495 13.6039 8.86861C13.5124 9.36656 13.3663 10.0254 13.1475 10.6816C12.9268 11.3438 12.6425 11.9712 12.2888 12.4286C11.937 12.8834 11.5615 13.1165 11.1489 13.13C11.0437 13.1334 10.869 13.0788 10.6141 12.8219C10.3641 12.57 10.0977 12.1832 9.81847 11.6766C9.261 10.6655 8.71475 9.29566 8.16767 7.88442C8.11253 7.74222 8.05739 7.59956 8.00223 7.45689L8.00209 7.45652C7.51708 6.20186 7.03134 4.94531 6.55 3.97353C6.28245 3.43338 6.00175 2.95055 5.7048 2.59602C5.42367 2.26038 5.03636 1.92969 4.54417 1.92969C3.85159 1.92969 3.30489 2.2597 2.89009 2.72483C2.48469 3.17941 2.18608 3.78128 1.95609 4.39923C1.68278 5.13355 1.48458 5.95644 1.32812 6.68764V1.90625Z"
      fill={props.color || 'currentColor'}
    />
  </svg>
);
