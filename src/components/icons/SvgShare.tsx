import * as React from 'react';
import { SVGProps } from 'react';
const SvgShare = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" {...props}>
    <g
      fill="transparent"
      stroke="#aaa"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      data-name="Share"
    >
      <path
        strokeWidth={30.57519}
        d="M339.61 53.578h127.071v393.747H38.628V53.578H168.39"
        data-name="Pfad 246"
      />
      <path
        strokeWidth={30.57519}
        d="m252.655 53.578-103.711 103.69 103.69-103.69Zm0 0 103.69 103.69-103.69-103.69v326.135V53.578Z"
        data-name="Vereinigungsmenge 10"
      />
    </g>
  </svg>
);
export default SvgShare;
