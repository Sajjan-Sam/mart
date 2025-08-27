import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { type Product, type Request } from "@shared/schema";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: requests } = useQuery<Request[]>({
    queryKey: ["/api/requests"],
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-full px-6 py-3 text-base font-semibold text-white/95 mb-4 border border-white/20 shadow-lg">
              🎓 For IISER Bhopal Students
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl" data-testid="title-hero">
            HostelMart
          </h1>
          <p className="text-2xl md:text-3xl mb-10 text-blue-100 max-w-4xl mx-auto font-light leading-relaxed" data-testid="text-hero-subtitle">
            Buy & Sell hostel items with fellow IISER students. <br />
            <span className="text-cyan-200 font-medium">Your trusted campus marketplace.</span>
          </p>
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mx-auto max-w-4xl">
            <img 
              src="https://dair.iiserb.ac.in/images/home_slide/18.jpg" 
              alt="University campus with students" 
              className="w-full h-full object-cover"
              data-testid="img-hero-campus"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent" data-testid="title-available-items">
            🛒 Available Items
          </h2>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg" data-testid="text-items-count">
            {filteredProducts.length} items
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <Input 
              type="text" 
              placeholder="🔍 Search amazing items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
              data-testid="input-search"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 h-14 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm" data-testid="select-filter-category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🏷️ All Categories</SelectItem>
              <SelectItem value="books">📚 Books</SelectItem>
              <SelectItem value="furniture">🪑 Furniture</SelectItem>
              <SelectItem value="appliances">⚡ Appliances</SelectItem>
              <SelectItem value="clothing">👕 Clothing</SelectItem>
              <SelectItem value="sports">⚽ Sports</SelectItem>
              <SelectItem value="stationery">✏️ Stationery</SelectItem>
              <SelectItem value="other">📦 Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse" data-testid={`skeleton-product-${i}`}>
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16" data-testid="empty-state-products">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 text-base">Try adjusting your search or filter criteria.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Approved Requests Section */}
        {requests && requests.length > 0 && (
          <section className="mt-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-10" data-testid="title-item-requests">
              📋 Item Requests
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request: any) => (
                <div key={request.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300" data-testid={`card-request-${request.id}`}>
                  <h3 className="font-semibold text-lg mb-2" data-testid={`text-request-title-${request.id}`}>
                    {request.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3" data-testid={`text-request-description-${request.id}`}>
                    {request.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary" data-testid={`text-request-max-price-${request.id}`}>
                      Max: ₹{request.maxPrice / 100}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`} data-testid={`badge-request-urgency-${request.id}`}>
                      {request.urgency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-16 mt-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-cyan-600/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="text-4xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent" data-testid="text-footer-title">
              HostelMart
            </div>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-light" data-testid="text-footer-subtitle">
              Making hostel life easier, one transaction at a time. 
              <br />
              <span className="text-cyan-200 font-medium">Connect • Buy • Sell • Thrive</span>
            </p>
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <div className="text-base text-blue-100 font-medium" data-testid="text-footer-copyright">
                © 2025 HostelMart. Built for IISER Bhopal students, by students. 💙
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
