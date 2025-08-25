import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="title-hero">
            Student Marketplace
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100" data-testid="text-hero-subtitle">
            Buy and sell hostel items with fellow students
          </p>
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mx-auto max-w-4xl">
            <img 
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600" 
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900" data-testid="title-available-items">
            Available Items
          </h2>
          <div className="text-sm text-gray-600" data-testid="text-items-count">
            {filteredProducts.length} items available
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              data-testid="input-search"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-filter-category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="appliances">Appliances</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="stationery">Stationery</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse" data-testid={`skeleton-product-${i}`}>
                <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state-products">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Approved Requests Section */}
        {requests && requests.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8" data-testid="title-item-requests">
              Item Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request: any) => (
                <div key={request.id} className="bg-white rounded-xl shadow-md p-6" data-testid={`card-request-${request.id}`}>
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
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4" data-testid="text-footer-title">
              HostelMart
            </div>
            <p className="text-gray-400 mb-4" data-testid="text-footer-subtitle">
              Making hostel life easier, one transaction at a time
            </p>
            <div className="text-sm text-gray-500" data-testid="text-footer-copyright">
              © 2024 HostelMart. Built for students, by students.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
