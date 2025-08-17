import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Product {
  id: number;
  title: string;
  specs: string;
  price: number;
  brand: string;
  images: string[];
}

interface ProductCardProps {
  product: Product;
  onBuyNow?: (product: Product) => void;
}

export const ProductCard = ({ product, onBuyNow }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product);
    }
  };

  return (
    <>
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        onClick={() => setIsDetailOpen(true)}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {product.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        </div>
        
        <CardContent className="p-4 text-center">
          <div className="mb-3">
            <p className="text-lg font-bold text-primary">PKR {product.price}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button 
              size="sm"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${product.title} - Image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {product.images.length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            </div>
            
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-4">{product.title}</h3>
                {product.specs && (
                  <p className="text-muted-foreground mb-4">{product.specs}</p>
                )}
                <p className="text-3xl font-bold text-primary mb-6">PKR {product.price}</p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    addToCart(product);
                    toast({
                      title: "Added to cart",
                      description: `${product.title} has been added to your cart.`,
                    });
                    setIsDetailOpen(false);
                  }}
                >
                  Add to Cart
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    if (onBuyNow) {
                      onBuyNow(product);
                    }
                    setIsDetailOpen(false);
                  }}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};