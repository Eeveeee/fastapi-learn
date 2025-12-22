import type { PropsWithChildren } from "react";
import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar";
import { AppSidebar } from "./AppBarSidebar";

export function AppBar(props: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main>
        <SidebarTrigger class="left-0 top-0" />
        {props.children}
      </main>
    </SidebarProvider>
  );
}
