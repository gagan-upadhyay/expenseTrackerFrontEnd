import {
  Squares2X2Icon,
  WalletIcon,
  Square3Stack3DIcon,
  ChartPieIcon,
  MagnifyingGlassCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { MdOutlineAccountBalance } from "react-icons/md";

export const SIDEBAR_SECTIONS = [
  {
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
      { name: "Wallet", href: "/wallet", icon: WalletIcon },
      { name: "Account", href: "/account", icon: MdOutlineAccountBalance },
      { name: "Transactions", href: "/transactions", icon: Square3Stack3DIcon },
      { name: "Revenue Analytics", href: "/revenue-analytics", icon: ChartPieIcon },
      { name: "Search", href: "/search", icon: MagnifyingGlassCircleIcon },
      { name: "Settings", href: "/dashboard/user/settings", icon: Cog6ToothIcon },
    ],
  },
];