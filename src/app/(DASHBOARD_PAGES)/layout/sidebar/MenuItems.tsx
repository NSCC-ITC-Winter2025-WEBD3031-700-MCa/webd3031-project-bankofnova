import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },
  {
    navlabel: true,
    subheader: "User Management",
  },
  // {
  //   id: uniqueId(),
  //   title: "premium-tracking",
  //   icon: IconMoodHappy,
  //   href: "/premium-tracking",
  // },
  {
    id: uniqueId(),
    title: "user-management",
    icon: IconAperture,
    href: "/user-management",
  },
];

export default Menuitems;
