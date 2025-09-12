import "@/app/globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

interface PageLayoutProps {
  children: React.ReactNode;
  showHeaderFooter?: boolean;
}

export function PageLayout({ children, showHeaderFooter = true }: PageLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {showHeaderFooter && <Header />}
      <main className="min-h-screen p-4">
        {children}
      </main>
      {showHeaderFooter && (
        <footer className="p-4 text-sm text-center">
          <p>&copy; 2024 WTD-Jira. All rights reserved.</p>
        </footer>
      )}
      <Toaster position="bottom-center" />
    </ThemeProvider>
  );
}
