import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar";
import { AppSidebar } from "./AppBarSidebar";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../../api/me.api";
import { Outlet } from "react-router-dom";

export function AppBar() {
  const info = useQuery({ queryKey: ["me"], queryFn: getCurrentUser, retry: 0 });
  console.log("INFO: ", info);

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
