


export const siteConfig = {
    name: "DSL Admin Dashboard",
    description: "Professional dashboard for fleet operations and bookings",
    theme: "violet",
    layout: "vertical",
    hideSideBar: false,
    sidebarType: "popover",
    sidebarColor: null,
    navbarType: "sticky",
    footerType: "static",
    sidebarBg: "none",
    radius: 0.5,
    distanceUnit: process.env.NEXT_PUBLIC_DISTANCE_UNIT || "km", // "km" or "mi"
};
