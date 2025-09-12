import { ThemeToggle } from "./theme-toggle";
import { LanguageDropdown } from "./language-dropdown";
import Link from "next/link";

export default function Header() {
  return (
    <header className="p-4 relative">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-l font-bold hover:opacity-80 transition-opacity">
          WTD-Jira
        </Link>
        <div className="flex items-center gap-2">
          <LanguageDropdown />
          <ThemeToggle />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-border shadow-lg"></div>
    </header>
  );
}
