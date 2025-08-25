import { useState } from "react";
import { Link } from "wouter";
import { Store, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestModal } from "./request-modal";
import { SuggestionModal } from "./suggestion-modal";
import { AdminLoginModal } from "./admin-login-modal";
import { SellModal } from "./sell-modal";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">HostelMart</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                onClick={() => setIsSellModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                data-testid="button-sell-item"
              >
                Sell Item
              </Button>
              <Button 
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                data-testid="button-request-item"
              >
                Request Item
              </Button>
              <Button 
                onClick={() => setIsSuggestionModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
                data-testid="button-suggestions"
              >
                Suggestions
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="hover:bg-gray-100"
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
                    setIsSellModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                  data-testid="button-mobile-sell-item"
                >
                  Sell Item
                </Button>
                <Button 
                  onClick={() => {
                    setIsRequestModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  data-testid="button-mobile-request-item"
                >
                  Request Item
                </Button>
                <Button 
                  onClick={() => {
                    setIsSuggestionModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
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

      <SellModal 
        open={isSellModalOpen} 
        onOpenChange={setIsSellModalOpen} 
      />
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
