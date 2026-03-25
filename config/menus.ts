import { LayoutDashboard, CarFront, Banknote, Settings, ClipboardList, Users } from "lucide-react";
import { DASHBOARD_ROUTES } from "./routes";

export interface MenuItemProps {
    title: string;
    icon?: React.ComponentType<{ className?: string }>;
    href?: string;
    child?: MenuItemProps[];
    megaMenu?: MenuItemProps[];
    multi_menu?: MenuItemProps[];
    nested?: MenuItemProps[];
    onClick?: () => void;
    isHeader?: boolean;
    roles?: string[];
}
export const menus: MenuItemProps[] = [
    {
        isHeader: true,
        title: "menu",
    },
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: DASHBOARD_ROUTES.DASHBOARD,
    },
    {
        title: "Fleets",
        icon: CarFront,
        href: DASHBOARD_ROUTES.FLEETS,
    },
    {
        title: "Bookings",
        icon: ClipboardList,
        href: DASHBOARD_ROUTES.BOOKINGS,
    },
    {
        title: "Users",
        icon: Users,
        href: DASHBOARD_ROUTES.USERS,
    },
    {
        title: "Payments",
        icon: Banknote,
        href: "/payments",
    },
    {
        title: "Fleet Pricing",
        icon: Banknote,
        child: [],
    },
    {
        title: "Settings",
        icon: Settings,
        child: [
            {
                title: "Booking Settings",
                href: DASHBOARD_ROUTES.SETTINGS_BOOKING,
            }
        ]
    }
];

export type MenuItemType = (typeof menus)[number];
