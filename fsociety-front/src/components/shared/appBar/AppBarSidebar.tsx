import { KeyIcon, LogInIcon } from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  Sidebar,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import { Link, NavLink } from "react-router-dom";

const items = [
  {
    title: "Login",
    url: "login",
    icon: LogInIcon,
  },
  {
    title: "SignUp",
    url: "/signup",
    icon: KeyIcon,
  },
];
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={{
                        pathname: item.url,
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>{" "}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
