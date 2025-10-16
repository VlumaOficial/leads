import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"; // This will now render PrivacyConsent
import NotFound from "./pages/NotFound";
import PrivacyConsent from "./pages/PrivacyConsent";
import WelcomeScreen from "./pages/WelcomeScreen";
import QuestionnaireScreen from "./pages/QuestionnaireScreen";
import ContactScreen from "./pages/ContactScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivacyConsent />} /> {/* Initial screen */}
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/questionnaire/:step" element={<QuestionnaireScreen />} />
          <Route path="/contact" element={<ContactScreen />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;