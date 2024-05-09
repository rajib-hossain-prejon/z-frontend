import * as React from 'react';

function SvgListBullet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.5 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8 5a1 1 0 0 0 0 2h13a1 1 0 1 0 0-2H8ZM8 11a1 1 0 1 0 0 2h13a1 1 0 1 0 0-2H8ZM7 18a1 1 0 0 1 1-1h13a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1ZM5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3.5 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        fill="#000"
      />
    </svg>
  );
}

export default SvgListBullet;
