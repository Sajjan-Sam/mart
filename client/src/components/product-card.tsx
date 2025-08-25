import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flag, ShoppingBag, Eye } from "lucide-react";
import { type Product } from "@shared/schema";
import { formatCurrency, createWhatsAppLink } from "@/lib/utils";
import { FlagModal } from "./flag-modal";
import { MarkSoldModal } from "./mark-sold-modal";
import { ImageSlider } from "./image-slider";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isMarkSoldModalOpen, setIsMarkSoldModalOpen] = useState(false);
  const [isImageSliderOpen, setIsImageSliderOpen] = useState(false);

  const handleContactSeller = () => {
    const whatsappLink = createWhatsAppLink(product.sellerPhone, product.name);
    window.open(whatsappLink, '_blank');
  };

  const handleImageClick = () => {
    if (product.images && product.images.length > 0) {
      setIsImageSliderOpen(true);
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 hover:-translate-y-2 group" data-testid={`card-product-${product.id}`}>
      <div className="aspect-video overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative group cursor-pointer" onClick={handleImageClick}>
        <img 
          src={product.images?.[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-product-${product.id}`}
        />
        {/* Image overlay */}
        {product.images && product.images.length > 0 && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center">
              <Eye className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">View Images</p>
              {product.images.length > 1 && (
                <p className="text-xs opacity-90">{product.images.length} photos</p>
              )}
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2" data-testid={`text-name-${product.id}`}>
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
            {formatCurrency(product.price)}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-gray-500 line-through" data-testid={`text-original-price-${product.id}`}>
              {formatCurrency(product.originalPrice)}
            </p>
          )}
        </div>
        <div className="flex gap-2 mb-3">
          <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${product.id}`}>
            {product.category}
          </Badge>
          <Badge variant="outline" className="text-xs" data-testid={`badge-condition-${product.id}`}>
            {product.condition}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2" data-testid={`text-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex gap-2 mb-4 text-xs text-gray-500">
          {product.priceNegotiable && (
            <Badge variant="outline" className="text-xs" data-testid={`badge-negotiable-${product.id}`}>
              Negotiable
            </Badge>
          )}
          {product.deliveryAvailable && (
            <Badge variant="outline" className="text-xs" data-testid={`badge-delivery-${product.id}`}>
              Delivery Available
            </Badge>
          )}
        </div>
        <div className="space-y-2">
          <Button 
            onClick={handleContactSeller}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-200"
            data-testid={`button-contact-${product.id}`}
          >
            <i className="fab fa-whatsapp mr-2"></i>
            Contact on WhatsApp
          </Button>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsMarkSoldModalOpen(true)}
              variant="outline"
              size="sm"
              className="flex-1 text-green-700 border-green-200 hover:bg-green-50"
              data-testid={`button-mark-sold-${product.id}`}
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Mark Sold
            </Button>
            <Button 
              onClick={() => setIsFlagModalOpen(true)}
              variant="outline"
              size="sm"
              className="flex-1 text-red-700 border-red-200 hover:bg-red-50"
              data-testid={`button-flag-${product.id}`}
            >
              <Flag className="h-4 w-4 mr-1" />
              Report
            </Button>
          </div>
        </div>

        <FlagModal 
          open={isFlagModalOpen}
          onOpenChange={setIsFlagModalOpen}
          productId={product.id}
          productName={product.name}
        />
        
        <MarkSoldModal 
          open={isMarkSoldModalOpen}
          onOpenChange={setIsMarkSoldModalOpen}
          productId={product.id}
          productName={product.name}
        />

        <ImageSlider
          images={product.images || []}
          open={isImageSliderOpen}
          onOpenChange={setIsImageSliderOpen}
          initialIndex={0}
        />
      </CardContent>
    </Card>
  );
}
