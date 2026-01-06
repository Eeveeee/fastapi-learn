import { KeyIcon, LogInIcon, UserIcon, UsersIcon } from "lucide-react";
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
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";

const items = [
  {
    title: "Login",
    url: "login",
    icon: LogInIcon,
    public: true,
  },
  {
    title: "SignUp",
    url: "/signup",
    icon: KeyIcon,
    public: true,
  },
  {
    title: "Users",
    url: "/users",
    icon: UsersIcon,
  },
  { title: "Profile", url: "/self", icon: UserIcon },
];
export function AppSidebar() {
  const isAuthorized = useAppSelector((state) => state.auth.isAuthorized);

  const routes = isAuthorized ? items.filter((r) => !r.public) : items.filter((r) => r.public);

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((item) => (
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
