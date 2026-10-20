import type { ReactNode, SVGProps } from 'react'

/** Iconos de trazo copiados del diseño. Siempre decorativos: el texto accesible va en el control. */
type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number }

function Icon({ size = 20, strokeWidth = 2, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const HeartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z" />
  </Icon>
)

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M16.5 16.5L21 21" />
  </Icon>
)

export const CloseIcon = (p: IconProps) => (
  <Icon strokeWidth={2.5} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
)

export const ChevronLeftIcon = (p: IconProps) => (
  <Icon strokeWidth={2.2} {...p}>
    <path d="M15 6l-6 6 6 6" />
  </Icon>
)

export const ChevronRightIcon = (p: IconProps) => (
  <Icon strokeWidth={2.2} {...p}>
    <path d="M9 6l6 6-6 6" />
  </Icon>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <Icon strokeWidth={2.2} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
)

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M14 7l5 5-5 5" />
  </Icon>
)

export const CalendarIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Icon>
)

export const GaugeIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}>
    <path d="M4 17a8 8 0 1 1 16 0" />
    <path d="M12 17l3.5-5" />
  </Icon>
)

export const FuelIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}>
    <path d="M5 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16M3.5 21h12M14 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8.5L18.5 6M7.5 7.5h4" />
  </Icon>
)

export const GearboxIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}>
    <circle cx="6" cy="5" r="1.8" />
    <circle cx="12" cy="5" r="1.8" />
    <circle cx="18" cy="5" r="1.8" />
    <circle cx="6" cy="19" r="1.8" />
    <circle cx="12" cy="19" r="1.8" />
    <path d="M6 7v10M12 7v10M18 7v5H6" />
  </Icon>
)

export const PinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </Icon>
)

export const CompareIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}>
    <rect x="3" y="4" width="7.5" height="16" rx="1.5" />
    <rect x="13.5" y="4" width="7.5" height="16" rx="1.5" />
  </Icon>
)

export const CheckIcon = (p: IconProps) => (
  <Icon strokeWidth={2.6} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
)

export const ShieldCheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l7.5 3v6c0 4.6-3.2 7.7-7.5 9-4.3-1.3-7.5-4.4-7.5-9V6z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </Icon>
)

export const ReturnIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" />
  </Icon>
)

export const DocumentIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5M10 13h6M10 17h6" />
  </Icon>
)

export const ShareIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
  </Icon>
)

export const FiltersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
    <circle cx="15" cy="6" r="2" />
    <circle cx="9" cy="12" r="2" />
    <circle cx="17" cy="18" r="2" />
  </Icon>
)

export const PlusIcon = (p: IconProps) => (
  <Icon strokeWidth={2.2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
