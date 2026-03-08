import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CityProvider } from "@/context/CityContext";
import Index from "./pages/Index";
import Wizard from "./pages/Wizard";
import DashboardLayout from "./components/DashboardLayout";
import BiddingPage from "./pages/BiddingPage";
import ViewBidsPage from "./pages/ViewBidsPage";
import ChatPage from "./pages/ChatPage";
import ActiveOrdersPage from "./pages/ActiveOrdersPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ForTailorsPage from "./pages/ForTailorsPage";
import StartPage from "./pages/StartPage";
import AlterationFlow from "./pages/AlterationFlow";
import CustomiseFlow from "./pages/CustomiseFlow";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderDetailPage from "./pages/OrderDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CityProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/for-tailors" element={<ForTailorsPage />} />
            <Route path="/start" element={<StartPage />} />
            <Route path="/wizard" element={<Wizard />} />
            <Route path="/alteration" element={<AlterationFlow />} />
            <Route path="/customise" element={<CustomiseFlow />} />
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
      </CityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
