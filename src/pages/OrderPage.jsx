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
  ShieldAlert,
} from "lucide-react";
import { UserData } from "@/context/UserContext";

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = UserData();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
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

    getOrder();
  }, [id]);

  if (loading) return <Loading />;

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Order not found</h1>
        <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  /* ================= AUTHORIZATION CHECK ================= */
  const isAuthorized =
    user && (user?._id === order.user?._id || user?.role === "admin");

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-destructive" />
        <h1 className="text-xl font-semibold">Unauthorized Access</h1>
        <p className="text-muted-foreground">
          This order does not belong to you.
        </p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  /* ================= STATUS STYLE ================= */
  const statusStyle = {
    Pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Delivered:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Review your purchase and track delivery
            </p>
          </div>

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* ORDER SUMMARY */}
          <Card className="rounded-3xl border border-border shadow-md">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <PackageCheck className="h-5 w-5 text-primary" />
                  Order Summary
                </h2>

                <Badge
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusStyle[order.status] || ""
                  }`}
                >
                  {order.status}
                </Badge>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase">
                    Order ID
                  </p>
                  <p className="font-medium break-all">#{order._id}</p>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{order.items.length}</span>
                </div>

                {/* PREMIUM TOTAL BLOCK */}
                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-primary">
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
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SHIPPING DETAILS */}
          <Card className="rounded-3xl border border-border shadow-md">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-xl font-semibold">Shipping Details</h2>

              <div className="space-y-4 text-sm">
                <p className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {order.user?.email}
                </p>

                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {order.phone}
                </p>

                <p className="flex items-start gap-3">
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
          <h2 className="text-2xl font-semibold mb-8">Ordered Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {order.items.map((e, i) => (
              <Card
                key={i}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border group"
              >
                <Link to={`/product/${e.product._id}`}>
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    <img
                      src={e.product.images[0]?.url}
                      alt={e.product.title}
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <CardContent className="p-5 space-y-2">
                  <h3 className="font-semibold line-clamp-1">
                    {e.product.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Quantity: {e.quantity}
                  </p>

                  <p className="font-medium text-primary">
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
