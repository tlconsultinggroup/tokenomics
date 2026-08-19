import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import PageBackground from "./components/PageBackground";
import { useTheme, applyThemeToDocument } from "./lib/hooks/useTheme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const theme = useTheme((s) => s.theme);
  const reduceMotion = useTheme((s) => s.reduceMotion);

  useEffect(() => {
    applyThemeToDocument(theme, reduceMotion);
  }, [theme, reduceMotion]);

  return (
    <ErrorBoundary>
      {!reduceMotion && <PageBackground />}
      <QueryClientProvider client={queryClient}>
        <Layout />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
