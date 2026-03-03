import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Wizard from "./pages/Wizard";
import DashboardLayout from "./components/DashboardLayout";
import BiddingPage from "./pages/BiddingPage";
import ViewBidsPage from "./pages/ViewBidsPage";
import ChatPage from "./pages/ChatPage";
import ActiveOrdersPage from "./pages/ActiveOrdersPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<BiddingPage />} />
            <Route path="view-bids" element={<ViewBidsPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="active-orders" element={<ActiveOrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
