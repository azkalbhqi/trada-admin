export interface NavLink {
  name: string;
  path: string;
}

export const NAV_LINKS: NavLink[] = [
  {
    name: "Dashboard",
    path: "/",
  },
  {
    name: "Signals",
    path: "/signal",
  },
  {
    name: "Information",
    path: "/information",
  },
];