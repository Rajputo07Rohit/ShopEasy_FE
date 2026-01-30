import { Button } from "@/components/ui/button";
import { CartData } from "@/context/CartContext";
import { server } from "@/main";
import axios from "axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const OrderProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCart } = CartData();

  const [status, setStatus] = useState("loading");
  // loading | success | error

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error("Payment session missing");
        navigate("/cart");
        return;
      }

      try {
        const { data } = await axios.post(
          `${server}/api/order/verify/payment`,
          { session_id: sessionId },
          {
            headers: {
              token: Cookies.get("token"),
            },
          }
        );

        if (data.success) {
          toast.success("Order placed successfully");
          setStatus("success");
          getCart();
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* ================= CARD ================= */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg text-center">
        {/* ================= LOADING ================= */}
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-semibold mb-2">
              Processing your order
            </h1>
            <p className="text-muted-foreground text-sm">
              Please wait while we verify your payment. Do not refresh this
              page.
            </p>
          </>
        )}

        {/* ================= SUCCESS ================= */}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-14 w-14 mx-auto text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order Confirmed 🎉</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for shopping with us. Your order has been placed
              successfully.
            </p>

            <Button
              className="w-full h-12 rounded-xl"
              onClick={() => navigate("/order")}
            >
              View My Orders
            </Button>
          </>
        )}

        {/* ================= ERROR ================= */}
        {status === "error" && (
          <>
            <XCircle className="h-14 w-14 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
            <p className="text-muted-foreground mb-6">
              Something went wrong while processing your payment. Please try
              again.
            </p>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl"
              onClick={() => navigate("/cart")}
            >
              Back to Cart
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderProcessing;
