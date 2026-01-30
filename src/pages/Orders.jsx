import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackageOpen, ArrowRight, Calendar } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/api/order/all`, {
        headers: { token: Cookies.get("token") },
      });

      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) return <Loading />;

  /* ================= EMPTY STATE ================= */
  if (orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <PackageOpen className="h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-2">No orders yet</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          When you place your first order, it will appear here.
        </p>
        <Button
          size="lg"
          className="rounded-full px-8"
          onClick={() => navigate("/products")}
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ================= HEADER ================= */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your purchases
          </p>
        </div>

        {/* ================= ORDER GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="
                relative
                rounded-3xl
                border border-border
                bg-card
                p-6
                shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                transition-all
                duration-300
                group
              "
            >
              {/* STATUS BADGE */}
              <div className="absolute top-5 right-5">
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

              {/* ORDER ID */}
              <p className="text-xs text-muted-foreground mb-2">ORDER ID</p>
              <p className="font-medium truncate mb-6">#{order._id}</p>

              {/* DETAILS */}
              <div className="space-y-4 text-sm">
                {/* Items */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{order.items.length}</span>
                </div>

                {/* AMOUNT – PREMIUM */}
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-xl font-bold tracking-tight">
                    ₹ {order.subTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* CTA */}
              <Button
                className="
                  mt-8
                  w-full
                  rounded-full
                  h-11
                  flex items-center justify-center gap-2
                  group-hover:bg-primary
                "
                onClick={() => navigate(`/order/${order._id}`)}
              >
                View Order
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
