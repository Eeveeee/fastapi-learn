import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar";
import { AppSidebar } from "./AppBarSidebar";
import { Outlet } from "react-router-dom";

export function AppBar() {
  return (
    <SidebarProvider style={{ display: "flex", minHeight: "100vh" }}>
      <AppSidebar />

      <main style={{ flex: 1, padding: 16 }}>
        <SidebarTrigger class="left-0 top-0" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
