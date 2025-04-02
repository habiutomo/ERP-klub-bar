import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  menuItemId?: number;
}

interface OrderPanelProps {
  items: OrderItem[];
  onAddItem: (item: OrderItem) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClearOrder: () => void;
}

const OrderPanel = ({ 
  items, 
  onAddItem, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearOrder 
}: OrderPanelProps) => {
  const { toast } = useToast();
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxRate = 0.085; // 8.5%
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  const createOrderMutation = useMutation({
    mutationFn: async (status: 'pending' | 'completed') => {
      const orderItems = items.map(item => ({
        menuItemId: item.menuItemId || 0,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      return apiRequest("POST", "/api/orders", {
        tableNumber,
        customerName,
        status,
        totalAmount: subtotal,
        tax,
        grandTotal: total,
        bartenderId: 1, // Hardcoded for now, would come from logged in user
        items: orderItems
      });
    },
    onSuccess: () => {
      toast({
        title: "Order processed",
        description: "The order has been processed successfully.",
      });
      onClearOrder();
      setTableNumber('');
      setCustomerName('');
    },
    onError: (error) => {
      toast({
        title: "Error processing order",
        description: "There was an error processing the order. Please try again.",
        variant: "destructive",
      });
      console.error("Order error:", error);
    }
  });
  
  const handleSaveTab = () => {
    if (items.length === 0) {
      toast({
        title: "Empty order",
        description: "Please add items to the order before saving.",
        variant: "destructive",
      });
      return;
    }
    
    createOrderMutation.mutate('pending');
  };
  
  const handlePayment = () => {
    if (items.length === 0) {
      toast({
        title: "Empty order",
        description: "Please add items to the order before processing payment.",
        variant: "destructive",
      });
      return;
    }
    
    createOrderMutation.mutate('completed');
  };
  
  return (
    <div className="bg-white rounded-lg shadow flex flex-col h-full">
      <div className="p-4 border-b border-light-200">
        <h2 className="text-lg font-semibold text-dark-900">Current Order</h2>
        <div className="flex space-x-2 mt-2">
          <div className="flex-1">
            <label className="text-xs text-light-400 block">Table</label>
            <input 
              type="text" 
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full mt-1 border border-light-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-light-400 block">Customer Name</label>
            <input 
              type="text" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full mt-1 border border-light-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="divide-y divide-light-200">
          {items.length === 0 ? (
            <li className="py-8 text-center text-light-400">
              <i className="ri-shopping-cart-line text-2xl mb-2 block"></i>
              <p>No items in order</p>
            </li>
          ) : (
            items.map((item) => (
              <li key={item.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <div className="flex items-center mt-1">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center bg-light-100 rounded"
                    >
                      <i className="ri-subtract-line text-xs"></i>
                    </button>
                    <span className="mx-2 text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center bg-light-100 rounded"
                    >
                      <i className="ri-add-line text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="text-error text-xs mt-1 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      
      <div className="p-4 border-t border-light-200">
        <div className="flex justify-between text-sm mb-1">
          <span>Subtotal</span>
          <span className="font-mono">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>Tax (8.5%)</span>
          <span className="font-mono">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-dark-900 mb-4 mt-2 text-lg">
          <span>Total</span>
          <span className="font-mono">${total.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button 
            onClick={handleSaveTab}
            disabled={createOrderMutation.isPending}
            className="w-full py-2 bg-light-100 hover:bg-light-200 text-dark-900 rounded font-medium disabled:opacity-50"
          >
            {createOrderMutation.isPending ? 'Processing...' : 'Save Tab'}
          </button>
          <button 
            onClick={handlePayment}
            disabled={createOrderMutation.isPending}
            className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded font-medium disabled:opacity-50"
          >
            {createOrderMutation.isPending ? 'Processing...' : 'Payment'}
          </button>
        </div>
        <button 
          onClick={onClearOrder}
          className="w-full py-2 border border-light-300 text-dark-900 rounded font-medium hover:bg-light-100"
        >
          Clear Order
        </button>
      </div>
    </div>
  );
};

export default OrderPanel;
