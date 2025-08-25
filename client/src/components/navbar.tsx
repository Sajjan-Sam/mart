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
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-2xl sticky top-0 z-50 border-b border-blue-800 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-400 p-2.5 rounded-xl shadow-lg">
                <Store className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                HostelMart
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                onClick={() => setIsSellModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                data-testid="button-sell-item"
              >
                💰 Sell Item
              </Button>
              <Button 
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                data-testid="button-request-item"
              >
                🔍 Request Item
              </Button>
              <Button 
                onClick={() => setIsSuggestionModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                data-testid="button-suggestions"
              >
                💡 Suggestions
              </Button>
              <Button 
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                data-testid="button-admin-login"
              >
                🛡️ Admin
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-blue-800/50 py-6 bg-slate-900/95 backdrop-blur-lg">
              <div className="space-y-4">
                <Button 
                  onClick={() => {
                    setIsSellModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 shadow-lg"
                  data-testid="button-mobile-sell-item"
                >
                  💰 Sell Item
                </Button>
                <Button 
                  onClick={() => {
                    setIsRequestModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 shadow-lg"
                  data-testid="button-mobile-request-item"
                >
                  🔍 Request Item
                </Button>
                <Button 
                  onClick={() => {
                    setIsSuggestionModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 shadow-lg"
                  data-testid="button-mobile-suggestions"
                >
                  💡 Suggestions
                </Button>
                <Button 
                  onClick={() => {
                    setIsAdminLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 shadow-lg"
                  data-testid="button-mobile-admin-login"
                >
                  🛡️ Admin Login
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
