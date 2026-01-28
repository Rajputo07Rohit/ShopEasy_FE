import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartData } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart, Trash } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, totalItem, subTotal, updateCart, removeCart } = CartData();

  const navigate = useNavigate();

  const updateCartHandler = async (action, id) => {
    await updateCart(action, id);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>

        {/* ================= EMPTY CART ================= */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-2">
              Looks like you haven’t added anything yet
            </p>
            <Button
              className="mt-6 rounded-xl px-6"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          /* ================= CART LAYOUT ================= */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ================= CART ITEMS ================= */}
            <div className="lg:col-span-2 space-y-5">
              {cart.map((e) => (
                <div
                  key={e._id}
                  className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  {/* Product Image */}
                  <img
                    src={e.product.images[0].url}
                    alt={e.product.title}
                    className="w-full sm:w-24 sm:h-24 object-contain rounded-xl bg-muted cursor-pointer"
                    onClick={() => navigate(`/product/${e.product._id}`)}
                  />

                  {/* Product Info */}
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h2 className="text-base font-semibold line-clamp-1">
                      {e.product.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      ₹ {e.product.price}
                    </p>
                  </div>

                  {/* Right Controls (Quantity + Trash PERFECTLY ALIGNED) */}
                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateCartHandler("dec", e._id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="w-8 text-center font-medium">
                        {e.quantity}
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateCartHandler("inc", e._id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Trash Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 flex items-center justify-center text-red-500 hover:bg-red-500/10"
                      onClick={() => removeCart(e._id)}
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= SUMMARY ================= */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <Separator className="my-3" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{totalItem}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹ {subTotal}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹ {subTotal}</span>
              </div>

              <Button
                className="w-full mt-6 h-12 rounded-xl text-base"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>

              <p className="mt-3 text-xs text-muted-foreground text-center">
                Secure checkout • Fast delivery
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
