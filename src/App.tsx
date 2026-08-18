import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import PageBackground from "./components/PageBackground";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <PageBackground />
      <QueryClientProvider client={queryClient}>
        <Layout />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
