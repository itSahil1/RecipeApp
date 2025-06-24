import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import RecipeDetail from "./pages/recipe-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/recipe/:id" component={RecipeDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
