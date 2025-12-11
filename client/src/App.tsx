import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DiceCountGame from "@/pages/module-a-dice-count";
import JumpPathGame from "@/pages/module-b-jump-path";
import FeedingGame from "@/pages/module-c-feeding";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/count" component={DiceCountGame} />
      <Route path="/jump" component={JumpPathGame} />
      <Route path="/feed" component={FeedingGame} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
