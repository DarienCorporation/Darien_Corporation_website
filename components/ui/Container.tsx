import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function Container({ as: Tag = "div", className, children }: Props) {
  return <Tag className={[styles.container, className].filter(Boolean).join(" ")}>{children}</Tag>;
}
