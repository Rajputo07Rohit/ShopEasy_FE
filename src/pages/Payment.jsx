import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartData } from "@/context/CartContext";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Truck } from "lucide-react";

const Payment = () => {
  const { cart, subTotal, getCart } = CartData();

  const [address, setAddress] = useState(null);
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // ================= FETCH ADDRESS =================
  const fetchAddress = async () => {
    try {
      const { data } = await axios.get(`${server}/api/address/${id}`, {
        headers: { token: Cookies.get("token") },
      });
      setAddress(data);
    } catch (error) {
      toast.error("Failed to load address");
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [id]);

  // ================= PAYMENT HANDLER =================
  const paymentHandler = async () => {
    if (!method) return;

    // COD
    if (method === "cod") {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `${server}/api/order/new/cod`,
          {
            method,
            phone: address.phone,
            address: address.address,
          },
          {
            headers: { token: Cookies.get("token") },
          }
        );

        toast.success(data.message || "Order placed successfully");
        getCart();
        navigate("/order");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }

    // ONLINE
    if (method === "online") {
      try {
        setLoading(true);
        const stripe = await loadStripe(
          "pk_test_51Sun14IHEMSL1vdEp5IJ0esz0qCeYM0UioqMuLhaSd2MZ68yOTZBUC00p9qdcB9eoyPh1tXIZHvvtBWzzlZ6cAw700B4qISIvO"
        );

        const { data } = await axios.post(
          `${server}/api/order/new/online`,
          {
            method,
            phone: address.phone,
            address: address.address,
          },
          {
            headers: { token: Cookies.get("token") },
          }
        );

        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error("Failed to start payment");
        }
      } catch (error) {
        toast.error("Payment failed. Try again");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* ================= HEADER ================= */}
        <h1 className="text-3xl font-bold text-center">Secure Checkout</h1>

        {/* ================= PRODUCTS ================= */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <Separator className="mb-4" />

          <div className="space-y-4">
            {cart.map((e, i) => (
              <div key={i} className="flex items-center gap-4">
                <img
                  src={e.product.images[0].url}
                  alt={e.product.title}
                  className="w-16 h-16 object-contain rounded-lg bg-muted"
                />

                <div className="flex-1">
                  <p className="font-medium line-clamp-1">{e.product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹ {e.product.price} × {e.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹ {e.product.price * e.quantity}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹ {subTotal}</span>
          </div>
        </div>

        {/* ================= ADDRESS + PAYMENT ================= */}
        {address && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Delivery Address</h3>
              </div>
              <Separator />

              <p className="text-sm text-muted-foreground">{address.address}</p>
              <p className="text-sm text-muted-foreground">
                Phone: {address.phone}
              </p>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Payment Method</h3>
              </div>
              <Separator />

              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full p-3 rounded-xl border bg-background"
              >
                <option value="">Select payment method</option>
                <option value="cod">Cash on Delivery</option>
                <option value="online">Online Payment</option>
              </select>

              <Button
                className="w-full h-12 rounded-xl text-base"
                disabled={!method}
                onClick={paymentHandler}
              >
                {method === "online" ? "Pay Securely" : "Place Order"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
