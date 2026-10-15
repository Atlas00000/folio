import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function baseProps(props: IconProps): IconProps {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...props,
  };
}

export function IconSun(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
    </svg>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M19.5 13.2A7.5 7.5 0 0 1 10.8 4.5 7.8 7.8 0 1 0 19.5 13.2Z" />
    </svg>
  );
}

/** Display / system preference. */
export function IconSystem(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3.5" y="4.5" width="17" height="12" rx="1.5" />
      <path d="M8 20.5h8M12 16.5v4" />
    </svg>
  );
}
