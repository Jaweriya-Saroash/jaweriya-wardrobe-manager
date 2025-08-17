import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, Math.max(0, newQuantity));
  };

  const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const contact = formData.get('contact') as string;
    const address = formData.get('address') as string;
    const method = formData.get('method') as string;
    
    let orderDetails = `New Order Received:\n\nCustomer: ${name}\nContact: ${contact}\nAddress: ${address}\n\nOrder Details:\n`;
    
    items.forEach((item, i) => {
      orderDetails += `${i + 1}. ${item.title} - PKR ${item.price} x ${item.quantity} = PKR ${item.price * item.quantity}\n`;
    });
    
    orderDetails += `\nOrder Total: PKR ${totalPrice}`;
    
    if (method === 'email') {
      const mailtoLink = `mailto:jaweriyasofficial@gmail.com?subject=New Order Received&body=${encodeURIComponent(orderDetails)}`;
      window.location.href = mailtoLink;
    } else if (method === 'whatsapp') {
      const whatsappLink = `https://wa.me/923400434334?text=${encodeURIComponent(orderDetails)}`;
      window.location.href = whatsappLink;
    }
    
    clearCart();
    setIsCheckoutOpen(false);
    toast({
      title: "Order placed!",
      description: "Your order has been submitted successfully."
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some products to your cart to continue shopping.</p>
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-muted-foreground">{item.brand}</p>
                      <p className="text-lg font-bold text-primary mt-2">PKR {item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-bold">PKR {item.price * item.quantity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>PKR {totalPrice}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-4">
                  <span>Total</span>
                  <span>PKR {totalPrice}</span>
                </div>
                
                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Place Order</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Complete Your Order</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact">Contact Number</Label>
                        <Input id="contact" name="contact" type="tel" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" name="address" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Order Method</Label>
                        <RadioGroup name="method" defaultValue="email">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="email" />
                            <Label htmlFor="email">Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="whatsapp" id="whatsapp" />
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <Button type="submit" className="w-full">Submit Order</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  Clear Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}