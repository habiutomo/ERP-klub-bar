import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import POS from "@/pages/pos";
import Inventory from "@/pages/inventory";
import Staff from "@/pages/staff";
import Customers from "@/pages/customers";
import Events from "@/pages/events";
import Finances from "@/pages/finances";
import Settings from "@/pages/settings";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import { useState } from "react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { useConfirmation } from "@/hooks/use-confirmation";

type CurrentUser = {
  name: string;
  role: string;
  avatar: string;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const { confirmationState, closeConfirmation } = useConfirmation();
  
  const currentUser: CurrentUser = {
    name: "Alex Manager",
    role: "Manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-full flex overflow-hidden bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950">
        <Sidebar 
          currentUser={currentUser} 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar} 
        />
        
        {/* Dark overlay for mobile when sidebar is open */}
        {sidebarOpen && window.innerWidth < 1024 && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className="flex-1 flex flex-col lg:pl-64 relative">
          <Header currentUser={currentUser} onToggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 text-gray-200">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/pos" component={POS} />
              <Route path="/inventory" component={Inventory} />
              <Route path="/staff" component={Staff} />
              <Route path="/customers" component={Customers} />
              <Route path="/events" component={Events} />
              <Route path="/finances" component={Finances} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
        
        {confirmationState.show && (
          <ConfirmationDialog
            title={confirmationState.title}
            message={confirmationState.message}
            onConfirm={() => {
              confirmationState.onConfirm?.();
              closeConfirmation();
            }}
            onCancel={closeConfirmation}
          />
        )}
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
