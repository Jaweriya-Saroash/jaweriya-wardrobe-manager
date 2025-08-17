import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: number;
  title: string;
  specs: string;
  price: number;
  brand: string;
  images: string[];
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specs.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products."
      });
    }
  };

  const handleBuyNow = (product: Product) => {
    clearCart();
    // In a real app, you might navigate to checkout or open an order modal
    toast({
      title: "Buy Now",
      description: `${product.title} selected for purchase. This would open checkout.`
    });
  };

  const groupedProducts = {
    Nishat: filteredProducts.filter(p => p.brand === 'Nishat'),
    'Junaid Jamshaid': filteredProducts.filter(p => p.brand === 'Junaid Jamshaid'),
    Beechtree: filteredProducts.filter(p => p.brand === 'Beechtree'),
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-accent/10 py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Style That Speaks
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Using every aspect—from fabric to accessories—our collections celebrate 
                individuality and empower women.
              </p>
              <Button size="lg" className="text-lg px-8 py-6">
                <a href="#products">Explore Collection</a>
              </Button>
            </div>
            <div className="text-center">
              <img
                src="/hsi.png"
                alt="Fashionable Woman"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Our Products</h2>
            <div className="max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>

          {Object.entries(groupedProducts).map(([brand, brandProducts]) => (
            brandProducts.length > 0 && (
              <div key={brand} className="mb-16">
                <h3 className="text-3xl font-bold text-center mb-8">{brand}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {brandProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onBuyNow={handleBuyNow}
                    />
                  ))}
                </div>
              </div>
            )
          ))}

          {filteredProducts.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No products found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">About Us</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                At Jaweriya Saroash, we believe in empowering women through distinctive fashion. 
                Our collections blend timeless elegance with modern innovation—each piece is 
                carefully crafted to celebrate individuality and inspire confidence.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We push creative boundaries while staying true to classic charm. Every garment 
                not only elevates your style but also reflects a lifestyle where sophistication 
                meets substance.
              </p>
            </div>
            <div className="text-center">
              <img
                src="/logo.jpg"
                alt="About Us"
                className="max-w-sm mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
            <p className="text-xl text-muted-foreground">Get in touch for inquiries and support.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center">
              <img
                src="/hsi.jpg"
                alt="Contact"
                className="max-w-sm mx-auto rounded-lg shadow-lg mb-8"
              />
            </div>
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-8">
                  <a
                    href="https://instagram.com/jaweriyas_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent transition-colors"
                  >
                    <i className="fab fa-instagram text-3xl"></i>
                  </a>
                  <a
                    href="https://wa.me/923400434334"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent transition-colors"
                  >
                    <i className="fab fa-whatsapp text-3xl"></i>
                  </a>
                  <a
                    href="mailto:jaweriyasofficial@gmail.com"
                    className="text-primary hover:text-accent transition-colors"
                  >
                    <i className="fas fa-envelope text-3xl"></i>
                  </a>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg">WhatsApp: +92 340 0434334</p>
                  <p className="text-lg">Email: jaweriyasofficial@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-8">
        <div className="container text-center">
          <p className="text-muted-foreground">
            © 2025 Jaweriya Saroash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
