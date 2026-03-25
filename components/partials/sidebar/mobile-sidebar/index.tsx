"use client";
import React, { useState, useMemo } from "react";
import { cn, isLocationMatch } from "@/lib/utils";
import { useSidebar, useThemeStore } from "@/store";
import SidebarLogo from "../common/logo";
import { menus } from "@/config/menus";
import MenuLabel from "../common/menu-label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";
import NestedSubMenu from "../common/nested-menus";
import { Car, Clock } from "lucide-react";
import { useFleets } from "@/hooks/use-fleet";
import { DASHBOARD_ROUTES } from "@/config/routes";

const MobileSidebar = ({ className }: { className?: string }) => {
  const { sidebarBg, mobileMenu, setMobileMenu } = useSidebar();
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [activeMultiMenu, setMultiMenu] = useState<number | null>(null);

  const { data: fleetsData } = useFleets();

  const allMenus: any[] = useMemo(() => {
    return menus.map((menu) => {
      if (menu.title === "Fleet Pricing") {
        return {
          ...menu,
          child: fleetsData?.data?.map((fleet: any) => ({
            title: fleet.name,
            href: DASHBOARD_ROUTES.FLEET_PRICING_DETAILS(fleet._id),
          })) || [],
        };
      }
      return menu;
    });
  }, [fleetsData]);

  const { collapsed } = useSidebar();

  const toggleSubmenu = (i: number) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  const toggleMultiMenu = (subIndex: number) => {
    if (activeMultiMenu === subIndex) {
      setMultiMenu(null);
    } else {
      setMultiMenu(subIndex);
    }
  };
  const locationName = usePathname();

  React.useEffect(() => {
    let subMenuIndex = null;
    let multiMenuIndex = null;

    allMenus.forEach((item: any, i: number) => {
      if (item?.child) {
        const childIndex = item.child.findIndex((childItem: any) =>
          isLocationMatch(childItem.href, locationName)
        );
        if (childIndex !== -1) {
          subMenuIndex = i;
        }
      }
    });

    setActiveSubmenu(subMenuIndex);
    setMultiMenu(multiMenuIndex);
    if (mobileMenu) {
      setMobileMenu(false);
    }
  }, [locationName, allMenus]);
  return (
    <>
      <div
        className={cn(
          "fixed top-0 bg-card h-full w-[248px] z-[9999] ",
          className,
          {
            " -left-[300px] invisible opacity-0 ": !mobileMenu,
            " left-0 visible opacity-100 ": mobileMenu,
          }
        )}
      >
        {sidebarBg !== "none" && (
          <div
            className=" absolute left-0 top-0 z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]"
            style={{ backgroundImage: `url(${sidebarBg})` }}
          ></div>
        )}
        <SidebarLogo />
        <ScrollArea
          className={cn("sidebar-menu h-[calc(100%-80px)] ", {
            "px-4": !collapsed,
          })}
        >
          <ul
            className={cn("", {
              " space-y-2 text-center": collapsed,
            })}
          >
            {allMenus.map((item, i) => (
              <li key={`menu_key_${i}`}>
                {!item?.child && !item?.isHeader && (
                  <SingleMenuItem item={item} collapsed={collapsed} />
                )}
                {item.isHeader && !item.child && !collapsed && (
                  <MenuLabel item={item} />
                )}
                {item.child && (
                  <>
                    <SubMenuHandler
                      item={item}
                      toggleSubmenu={toggleSubmenu}
                      index={i}
                      activeSubmenu={activeSubmenu}
                      collapsed={collapsed}
                    />

                    {!collapsed && (
                      <NestedSubMenu
                        toggleMultiMenu={toggleMultiMenu}
                        activeMultiMenu={activeMultiMenu}
                        activeSubmenu={activeSubmenu}
                        item={item}
                        index={i} />
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="overlay bg-black/60 backdrop-filter backdrop-blur-sm opacity-100 fixed inset-0 z-[999]"
        ></div>
      )}
    </>
  );
};

export default MobileSidebar;
