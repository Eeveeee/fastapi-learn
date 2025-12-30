import { KeyIcon, LogInIcon, UsersIcon } from "lucide-react";
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
];
export function AppSidebar() {
  const isAuthorized = useAppSelector((state) => state.auth.isAuthorized);
  console.log("IS AUTH: ", isAuthorized);

  const routes = items.filter((r) => (r.public && !isAuthorized) || !r.public);

  console.log("ROUTES: ", routes);

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
