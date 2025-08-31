// import Game from "./pages/Game";
// import Python from "./pages/Python";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
import Python from "./pages/Python";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import Index from "./pages/Index";

// const Home = () => <div style={{padding: 40, fontSize: 32}}>Home funcionando</div>;

const App = () => (
  <BrowserRouter>
    <Routes>
  <Route path="/" element={<Index />} />
  <Route path="/python" element={<Python />} />
  <Route path="/python/:level" element={<Game />} />
    </Routes>
  </BrowserRouter>
);

export default App;
