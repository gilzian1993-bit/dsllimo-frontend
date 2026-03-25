import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashBoardLayoutProvider>{children}</DashBoardLayoutProvider>
  );
};

export default Layout;
