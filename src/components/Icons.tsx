import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Svg(props: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export const IconPhone = (p: P) => (
  <Svg {...p}>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </Svg>
);

export const IconChat = (p: P) => (
  <Svg {...p}>
    <path d="M4 5h16v11H9l-5 4V5z" />
    <path d="M8 10h8M8 13h5" />
  </Svg>
);

export const IconCalendar = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Svg>
);

export const IconBed = (p: P) => (
  <Svg {...p}>
    <path d="M3 18V6M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6" />
    <circle cx="7" cy="11" r="2" />
  </Svg>
);

export const IconUsers = (p: P) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 19c.8-3.4 3.2-5 6-5s5.2 1.6 6 5" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.5c1.5.6 2.6 2 3 4.5" />
  </Svg>
);

export const IconArea = (p: P) => (
  <Svg {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </Svg>
);

export const IconCar = (p: P) => (
  <Svg {...p}>
    <path d="M5 16V11l2-5h10l2 5v5M3.5 11h17M5 16h14v2H5z" />
    <circle cx="7.5" cy="13.5" r=".6" fill="currentColor" />
    <circle cx="16.5" cy="13.5" r=".6" fill="currentColor" />
  </Svg>
);

export const IconTree = (p: P) => (
  <Svg {...p}>
    <path d="M12 21v-6M12 3c3.5 0 6 2.6 6 5.8 0 3.4-2.7 6.2-6 6.2s-6-2.8-6-6.2C6 5.6 8.5 3 12 3z" />
    <path d="M12 15l-2.5-2.5M12 12.5l2-2" />
  </Svg>
);

export const IconPin = (p: P) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
);

export const IconClock = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);

export const IconMail = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
    <path d="M4 7l8 6 8-6" />
  </Svg>
);

export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const IconPlay = (p: P) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M7 4.5v15l12-7.5z" />
  </Svg>
);

export const IconRings = (p: P) => (
  <Svg {...p}>
    <circle cx="9" cy="14" r="5" />
    <circle cx="15" cy="14" r="5" />
    <path d="M10 5l2-2 2 2-2 2z" />
  </Svg>
);

export const IconTicket = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z" />
    <path d="M14 7v10" strokeDasharray="1.5 2" />
  </Svg>
);

export const IconBriefcase = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="7" width="17" height="12" rx="1.5" />
    <path d="M9 7V5h6v2M3.5 12h17" />
  </Svg>
);

export const IconHeart = (p: P) => (
  <Svg {...p}>
    <path d="M12 19.5s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10z" />
  </Svg>
);
