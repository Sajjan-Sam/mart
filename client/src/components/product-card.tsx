import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Product } from "@shared/schema";
import { formatCurrency, createWhatsAppLink } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const handleContactSeller = () => {
    const whatsappLink = createWhatsAppLink(product.sellerPhone, product.name);
    window.open(whatsappLink, '_blank');
  };

  return (
    <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden" data-testid={`card-product-${product.id}`}>
      <div className="aspect-video overflow-hidden">
        <img 
          src={product.images?.[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
          alt={product.name}
          className="w-full h-full object-cover"
          data-testid={`img-product-${product.id}`}
        />
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
        <Button 
          onClick={handleContactSeller}
          className="w-full bg-secondary hover:bg-secondary/90"
          data-testid={`button-contact-${product.id}`}
        >
          <i className="fab fa-whatsapp mr-2"></i>
          Contact Seller
        </Button>
      </CardContent>
    </Card>
  );
}
