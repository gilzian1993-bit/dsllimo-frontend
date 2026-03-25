"use client";
import React, { useState, useMemo } from "react";

import { cn, isLocationMatch, getDynamicPath } from "@/lib/utils";
import SidebarLogo from "../common/logo";
import { menus } from "@/config/menus";
import MenuLabel from "../common/menu-label";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";
import NestedSubMenu from "../common/nested-menus";
import { useSidebar } from "@/store";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useFleets } from "@/hooks/use-fleet";
import { DASHBOARD_ROUTES } from "@/config/routes";

const PopoverSidebar = () => {
  const { collapsed, sidebarBg } = useSidebar();
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

  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);

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
  }, [locationName, allMenus]);

  // menu title

  return (
    <div
      className={cn("fixed top-0 border-r ", {
        "w-[248px]": !collapsed,
        "w-[72px]": collapsed,
        "m-6 bottom-0 bg-card rounded-md": true,
        "h-full bg-card ": false,
      })}
    >
      {sidebarBg !== "none" && (
        <div
          className=" absolute left-0 top-0 z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]"
          style={{ backgroundImage: `url(${sidebarBg})` }}
        ></div>
      )}
      <SidebarLogo />
      <Separator />
      <ScrollArea
        className={cn("sidebar-menu h-[calc(100%-80px)] ", {
          "px-4": !collapsed,
        })}
      >
        <ul
          dir="ltr"
          className={cn(" space-y-1", {
            " space-y-2 text-center": collapsed,
          })}
        >
          {allMenus.map((item, i) => (
            <li key={`menu_key_${i}`}>
              {/* single menu */}

              {!item?.child && !item?.isHeader && (
                <SingleMenuItem
                  item={item}
                  collapsed={collapsed}
                />
              )}

              {/* menu label */}
              {item.isHeader && !item.child && !collapsed && (
                <MenuLabel item={item} />
              )}

              {/* sub menu */}
              {item.child && (
                <>
                  <SubMenuHandler
                    item={item}
                    toggleSubmenu={toggleSubmenu}
                    index={i}
                    activeSubmenu={activeSubmenu}
                    collapsed={collapsed}
                    menuTitle={item.title}
                  />
                  {!collapsed && (
                    <NestedSubMenu
                      toggleMultiMenu={toggleMultiMenu}
                      activeMultiMenu={activeMultiMenu}
                      activeSubmenu={activeSubmenu}
                      item={item}
                      index={i}
                    />
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default PopoverSidebar;
