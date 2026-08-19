import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import PageBackground from "./components/PageBackground";
import { useTheme, applyThemeToDocument } from "./lib/hooks/useTheme";
import { useUpdaterStore } from "./lib/hooks/useUpdater";

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
  const checkForUpdate = useUpdaterStore((s) => s.checkForUpdate);

  useEffect(() => {
    applyThemeToDocument(theme, reduceMotion);
  }, [theme, reduceMotion]);

  // Check for updates once per app launch, not tied to any tab/view.
  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  return (
    <ErrorBoundary>
      {!reduceMotion && <PageBackground />}
      <QueryClientProvider client={queryClient}>
        <Layout />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
