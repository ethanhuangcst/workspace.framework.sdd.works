import Image from "next/image";
import { HOST } from "../../i18n/t";

export type LogoSize = "home" | "header" | "auth";

export type LogoProps = {
  size: LogoSize;
  href?: string;
  className?: string;
};

const SIZE_CONFIG: Record<
  LogoSize,
  { wrapClass: string; imgClass: string; width: number; height: number }
> = {
  home: {
    wrapClass: "logo logo-home",
    imgClass: "logo-full",
    width: 360,
    height: 200,
  },
  header: {
    wrapClass: "logo",
    imgClass: "logo-header-mark",
    width: 234,
    height: 130,
  },
  auth: {
    wrapClass: "logo logo-auth",
    imgClass: "logo-full",
    width: 360,
    height: 200,
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
