import {
  IconHome,
  IconCurrencyDollar,
  IconBuildingBank, // Alternative to IconBank
  IconTransfer,
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
    href: "/userprofile",
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
    title: "Transactions",
    icon: IconTransfer,
    href: "/transactions",
  },
  {
    id: uniqueId(),
    title: "E-Transfer",
    icon: IconTransfer,
    href: "/transactions/transfer",
  },
];

export default Menuitems;
