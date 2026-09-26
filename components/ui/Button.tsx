import { NavLink } from "@/components/navigation/NavLink";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "./Icons";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost";
type Tone = "light" | "dark";

type CommonProps = {
  variant?: Variant;
  /** Surface the button sits on. */
  tone?: Tone;
  icon?: ReactNode | false;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps & { href: string; external?: boolean };
type NativeProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
    loading?: boolean;
  };

function classes(variant: Variant, tone: Tone, extra?: string) {
  return [styles.button, styles[variant], tone === "dark" && styles.dark, extra].filter(Boolean).join(" ");
}

function Inner({
  icon,
  children,
  loading,
}: {
  icon: ReactNode | false;
  children: ReactNode;
  loading?: boolean;
}) {
  return (
    <>
      <span className={styles.wipe} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : icon === false ? null : (
        <span className={styles.icon} aria-hidden="true">
          {icon ?? <ArrowRight />}
        </span>
      )}
    </>
  );
}

export function Button(props: LinkProps | NativeProps) {
  const { variant = "primary", tone = "light", icon, className, children } = props;

  if (props.href !== undefined) {
    const { href, external } = props as LinkProps;
    const cls = classes(variant, tone, className);
    if (external) {
      return (
        <a href={href} className={cls} data-magnetic="" target="_blank" rel="noopener noreferrer">
          <Inner icon={icon}>{children}</Inner>
        </a>
      );
    }
    return (
      <NavLink href={href} className={cls} data-magnetic="">
        <Inner icon={icon}>{children}</Inner>
      </NavLink>
    );
  }

  const {
    loading,
    variant: _v,
    tone: _t,
    icon: _i,
    className: _c,
    children: _ch,
    disabled,
    type = "button",
    ...rest
  } = props as NativeProps;
  return (
    <button
      {...rest}
      type={type}
      className={classes(variant, tone, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading ? "" : undefined}
      data-magnetic=""
    >
      <Inner icon={icon} loading={loading}>
        {children}
      </Inner>
    </button>
  );
}
