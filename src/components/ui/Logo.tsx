import Image from "next/image";
import { HOST } from "../../i18n/t";

export type LogoSize = "home" | "header" | "auth";

export type LogoProps = {
  size: LogoSize;
  href?: string;
  className?: string;
};

const LOGO_INTRINSIC_WIDTH = 718;
const LOGO_INTRINSIC_HEIGHT = 256;

const SIZE_CONFIG: Record<
  LogoSize,
  { wrapClass: string; imgClass: string; width: number; height: number }
> = {
  home: {
    wrapClass: "logo logo-home",
    imgClass: "logo-full",
    width: LOGO_INTRINSIC_WIDTH,
    height: LOGO_INTRINSIC_HEIGHT,
  },
  header: {
    wrapClass: "logo",
    imgClass: "logo-header-mark",
    width: LOGO_INTRINSIC_WIDTH,
    height: LOGO_INTRINSIC_HEIGHT,
  },
  auth: {
    wrapClass: "logo logo-auth",
    imgClass: "logo-full",
    width: LOGO_INTRINSIC_WIDTH,
    height: LOGO_INTRINSIC_HEIGHT,
  },
};

function joinClass(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export function Logo({ size, href, className }: LogoProps) {
  const cfg = SIZE_CONFIG[size];
  const classes = joinClass(cfg.wrapClass, className);
  const img = (
    <Image
      className={cfg.imgClass}
      src="/sdd-logo.png"
      alt=""
      width={cfg.width}
      height={cfg.height}
      priority={size === "home" || size === "auth"}
    />
  );

  if (href) {
    return (
      <a className={classes} href={href} aria-label={HOST}>
        {img}
      </a>
    );
  }

  return (
    <div className={classes} aria-label={HOST}>
      {img}
    </div>
  );
}
