import { useState } from "react";
import { Link } from "wouter";
import { Store, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestModal } from "./request-modal";
import { SuggestionModal } from "./suggestion-modal";
import { AdminLoginModal } from "./admin-login-modal";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">HostelMart</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Button 
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-secondary hover:bg-secondary/90"
                data-testid="button-request-item"
              >
                Request Item
              </Button>
              <Button 
                onClick={() => setIsSuggestionModalOpen(true)}
                className="bg-accent hover:bg-accent/90"
                data-testid="button-suggestions"
              >
                Suggestions
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setIsAdminLoginModalOpen(true)}
                data-testid="button-admin-login"
              >
                Admin
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setIsRequestModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-secondary hover:bg-secondary/90"
                  data-testid="button-mobile-request-item"
                >
                  Request Item
                </Button>
                <Button 
                  onClick={() => {
                    setIsSuggestionModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-accent hover:bg-accent/90"
                  data-testid="button-mobile-suggestions"
                >
                  Suggestions
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsAdminLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full"
                  data-testid="button-mobile-admin-login"
                >
                  Admin Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <RequestModal 
        open={isRequestModalOpen} 
        onOpenChange={setIsRequestModalOpen} 
      />
      <SuggestionModal 
        open={isSuggestionModalOpen} 
        onOpenChange={setIsSuggestionModalOpen} 
      />
      <AdminLoginModal 
        open={isAdminLoginModalOpen} 
        onOpenChange={setIsAdminLoginModalOpen} 
      />
    </>
  );
}
