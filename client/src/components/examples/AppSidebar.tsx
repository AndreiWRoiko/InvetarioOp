import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from '../AppSidebar';

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          userRole="Admin"
          onLogout={() => console.log('Logout clicked')}
        />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold">Conteúdo Principal</h1>
          <p className="text-muted-foreground mt-2">A sidebar está funcionando!</p>
        </div>
      </div>
    </SidebarProvider>
  );
}
