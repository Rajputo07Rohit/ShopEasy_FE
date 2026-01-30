import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Printer,
  PackageCheck,
  Calendar,
  IndianRupee,
  MapPin,
  Phone,
  User,
} from "lucide-react";

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getOrder = async () => {
    try {
      const { data } = await axios.get(`${server}/api/order/${id}`, {
        headers: { token: Cookies.get("token") },
      });
      setOrder(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, [id]);

  if (loading) return <Loading />;

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          Order not found
        </h1>
        <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>

          <Button
            variant="outline"
            className="rounded-full flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
        </div>

        {/* ================= SUMMARY + SHIPPING ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* ORDER SUMMARY */}
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <PackageCheck className="h-5 w-5" />
                  Order Summary
                </h2>

                <Badge
                  className={
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }
                >
                  {order.status}
                </Badge>
              </div>

              <div className="text-sm space-y-3">
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-medium break-all">#{order._id}</p>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{order.items.length}</span>
                </div>

                {/* AMOUNT */}
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    Total Amount
                  </span>
                  <span className="text-xl font-bold">
                    ₹ {order.subTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium uppercase">{order.method}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Ordered On
                  </span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SHIPPING DETAILS */}
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6 space-y-5">
              <h2 className="text-xl font-semibold">Shipping Details</h2>

              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {order.user?.email || "Guest User"}
                </p>

                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {order.phone}
                </p>

                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>{order.address}</span>
                </p>

                <p className="text-muted-foreground">
                  Paid At:{" "}
                  <span className="font-medium">
                    {order.paidAt || "Cash on Delivery"}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= ORDER ITEMS ================= */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Ordered Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {order.items.map((e, i) => (
              <Card
                key={i}
                className="rounded-2xl border border-border shadow-sm hover:shadow-lg transition"
              >
                <Link to={`/product/${e.product._id}`}>
                  <div className="aspect-square bg-muted flex items-center justify-center rounded-t-2xl overflow-hidden">
                    <img
                      src={e.product.images[0]?.url}
                      alt={e.product.title}
                      className="h-full w-full object-contain hover:scale-105 transition"
                    />
                  </div>
                </Link>

                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold line-clamp-1">
                    {e.product.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Quantity: {e.quantity}
                  </p>

                  <p className="font-medium">
                    ₹ {e.product.price.toLocaleString("en-IN")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
