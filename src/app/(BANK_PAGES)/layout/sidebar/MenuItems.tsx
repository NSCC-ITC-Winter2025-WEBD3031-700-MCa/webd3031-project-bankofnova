import {
  IconHome,
  IconCurrencyDollar,
  IconArrowRight,  // Icon for E-Transfer
  IconDownload,    // Icon for Deposit
  IconArrowsLeftRight, // Icon for Move Money
  IconWallet,      // Alternative to IconPiggyBank
  IconSettings,    // Settings icon
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

// Menu Items with Settings and Divider
const Menuitems = [


  {
    id: uniqueId(),
    title: "Overview",
    icon: IconHome,
    href: "/overview",
  },
  // {
  //   navlabel: true,
  //   subheader: "Accounts",
  // },
  {
    id: uniqueId(),
    title: "Chequing",
    icon: IconCurrencyDollar,
    href: "/accounts/chequing",
  },
  {
    id: uniqueId(),
    title: "Savings",
    icon: IconWallet,
    href: "/accounts/savings",
  },
  // {
  //   navlabel: true,
  //   subheader: "Transactions",
  // },
  {
    id: uniqueId(),
    title: "Transfer",
    icon: IconArrowRight,
    href: "/transactions/transfer",
  },
  {
    id: uniqueId(),
    title: "Deposit",
    icon: IconDownload,
    href: "/transactions/deposit",
  },
  {
    id: uniqueId(),
    title: "Move Money",
    icon: IconArrowsLeftRight,
    href: "/transactions/movemoney",
  },
  {
    id: uniqueId(),
    title: "Settings",
    icon: IconSettings,
    href: "/settings",
  },
  // {
  //   id: uniqueId(),
  //   title: "Contacts",
  //   icon: IconSettings,
  //   href: "/contacts",
  // },
];

export default Menuitems;
