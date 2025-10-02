import { LayoutDashboard, Package, History, Users, Plus, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

interface AppSidebarProps {
  userRole?: "Admin" | "Suporte" | "Controle";
  onLogout?: () => void;
}

export default function AppSidebar({ userRole = "Admin", onLogout }: AppSidebarProps) {
  const [location] = useLocation();

  const menuItems = [
    ...(userRole === "Controle" ? [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ] : []),
    ...(userRole !== "Controle" ? [
      { title: "Inventário", url: "/inventario", icon: Package },
      { title: "Cadastrar Equipamento", url: "/cadastro", icon: Plus },
    ] : []),
    ...(userRole === "Admin" ? [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Gestão de Usuários", url: "/usuarios", icon: Users },
    ] : []),
    { title: "Histórico", url: "/historico", icon: History },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-semibold">
            Sistema de Inventário
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
