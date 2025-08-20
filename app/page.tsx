import ColdStorageCalculator from '@/components/cold-storage-calculator';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🧊</div>
              <div>
                <h1 className="text-2xl font-bold">
                  Cold Storage Technical Calculator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Professional cold storage requirement calculations
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <ColdStorageCalculator />
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © 2025 Cold Storage Technical Calculator. Built with Next.js,
              TypeScript, and Tailwind CSS.
            </p>
            <p className="mt-2">
              Calculations based on ASHRAE standards and refrigeration
              engineering principles.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
