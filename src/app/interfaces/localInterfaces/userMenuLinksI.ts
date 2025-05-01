import { type JSX } from "react";

export interface UserMenuLinksI {
  name: string;
  href: string;
  icon: JSX.Element;
  badge?: boolean;
  show: boolean;
}
