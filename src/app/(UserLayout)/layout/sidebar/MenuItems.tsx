import {
  IconHome,
  IconCurrencyDollar,
  IconBuildingBank, // Alternative to IconBank
  IconArrowRight,  // Icon for E-Transfer
  IconDownload,    // Icon for Deposit
  IconArrowsLeftRight, // Icon for Move Money
  IconWallet, // Alternative to IconPiggyBank
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Overview",
  },
  {
    id: uniqueId(),
    title: "Overview",
    icon: IconHome,
    href: "/overview",
  },
  {
    navlabel: true,
    subheader: "Accounts",
  },
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
  {
    navlabel: true,
    subheader: "Transactions",
  },
  {
    id: uniqueId(),
    title: "E-Transfer",
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
];

export default Menuitems;
