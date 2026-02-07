import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import Loading from "../Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Link } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import { Badge } from "../ui/badge";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // ✅ per-row loader

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/order/admin/all`, {
        headers: { token: Cookies.get("token") },
      });
      setOrders(data || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      const { data } = await axios.post(
        `${server}/api/order/${orderId}`,
        { status },
        { headers: { token: Cookies.get("token") } }
      );

      toast.success(data.message || "Order updated");
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= FILTER ================= */
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order?.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        order?._id?.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  /* ================= STATUS BADGE ================= */
  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: "bg-yellow-500/15 text-yellow-600",
      Shipped: "bg-blue-500/15 text-blue-600",
      Delivered: "bg-green-500/15 text-green-600",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer orders and update status
          </p>
        </div>

        <Input
          placeholder="Search by email or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-80"
        />
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <Loading />
      ) : filteredOrders.length > 0 ? (
        <div className="rounded-2xl border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id} className="hover:bg-muted/20">
                  <TableCell className="font-mono text-xs">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-primary hover:underline"
                    >
                      {order._id}
                    </Link>
                  </TableCell>

                  <TableCell>{order.user?.email}</TableCell>

                  <TableCell className="font-medium">
                    ₹ {order.subTotal}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {moment(order.createdAt).format("DD MMM YYYY")}
                  </TableCell>

                  <TableCell className="text-right">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="
                        px-3 py-2 text-sm rounded-lg border
                        bg-background
                        focus:outline-none focus:ring-2 focus:ring-primary
                        disabled:opacity-50
                      "
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          No orders found
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
