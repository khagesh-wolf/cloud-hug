import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/components/DataProvider";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import Hub from "./pages/Hub";
import TableOrder from "./pages/TableOrder";
import ScanTable from "./pages/ScanTable";
import Install from "./pages/Install";
import Counter from "./pages/Counter";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Kitchen from "./pages/Kitchen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <DataProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Root redirects to scan for customers */}
            <Route path="/" element={<Navigate to="/scan" replace />} />
            
            {/* Staff hub - requires knowing the URL */}
            <Route path="/hub" element={<Hub />} />
            
            {/* Customer routes */}
            <Route path="/scan" element={<ScanTable />} />
            <Route path="/install" element={<Install />} />
            <Route path="/table/:tableNumber" element={<TableOrder />} />
            
            {/* Staff routes */}
            <Route path="/counter" element={<Counter />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/auth" element={<Auth />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <OfflineIndicator />
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
