import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppSidebar from "@/components/AppSidebar";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Inventario from "@/pages/Inventario";
import CadastroEquipamento from "@/pages/CadastroEquipamento";
import Historico from "@/pages/Historico";
import GestaoUsuarios from "@/pages/GestaoUsuarios";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  const userRole = user.perfil as "Admin" | "Suporte" | "Controle";
  
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      {userRole !== "Controle" && (
        <>
          <Route path="/inventario">
            {() => <Inventario userRole={userRole} />}
          </Route>
          <Route path="/cadastro" component={CadastroEquipamento} />
        </>
      )}
      {userRole === "Admin" && (
        <Route path="/usuarios" component={GestaoUsuarios} />
      )}
      <Route path="/historico" component={Historico} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user, logout, isLoading } = useAuth();
  
  const style = {
    "--sidebar-width": "16rem",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const userRole = user.perfil as "Admin" | "Suporte" | "Controle";

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar userRole={userRole} onLogout={logout} />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{user.nome}</span> - {userRole}
            </div>
          </header>
          <main className="flex-1 overflow-auto p-8">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
