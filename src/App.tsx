import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CityProvider } from "@/context/CityContext";
import ScrollToTop from "@/components/ScrollToTop";
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
import OurStoryPage from "./pages/OurStoryPage";
import StartPage from "./pages/StartPage";
import AlterationFlow from "./pages/AlterationFlow";
import CustomiseFlow from "./pages/CustomiseFlow";
import UploadPage from "./pages/new-order/UploadPage";
import PaymentPage from "./pages/new-order/PaymentPage";
import BriefPage from "./pages/new-order/BriefPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import CancellationPage from "./pages/CancellationPage";
import NotFoundPage from "./pages/NotFoundPage";
import CareersPage from "./pages/CareersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import VendorLayout from "./vendor/layout/VendorLayout";
import VendorLeads from "./vendor/pages/VendorLeads";
import VendorMyBids from "./vendor/pages/VendorMyBids";
import VendorActiveOrders from "./vendor/pages/VendorActiveOrders";
import VendorWallet from "./vendor/pages/VendorWallet";
import VendorProfile from "./vendor/pages/VendorProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CityProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/for-tailors" element={<ForTailorsPage />} />
            <Route path="/our-story" element={<OurStoryPage />} />
            <Route path="/start" element={<StartPage />} />
            <Route path="/wizard" element={<Wizard />} />
            <Route path="/new-order/upload" element={<UploadPage />} />
            <Route path="/new-order/payment" element={<PaymentPage />} />
            <Route path="/new-order/brief" element={<BriefPage />} />
            <Route path="/alteration" element={<AlterationFlow />} />
            <Route path="/customise" element={<CustomiseFlow />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/cancellation" element={<CancellationPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/order/:id" element={<OrderDetailPage />} />
            <Route path="/vendor" element={<VendorLayout />}>
              <Route index element={<VendorLeads />} />
              <Route path="bids" element={<VendorMyBids />} />
              <Route path="orders" element={<VendorActiveOrders />} />
              <Route path="wallet" element={<VendorWallet />} />
              <Route path="profile" element={<VendorProfile />} />
            </Route>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<BiddingPage />} />
              <Route path="view-bids" element={<ViewBidsPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="active-orders" element={<ActiveOrdersPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </CityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
