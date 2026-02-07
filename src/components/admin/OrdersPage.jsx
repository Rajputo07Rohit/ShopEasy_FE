import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/api/order/admin/all`, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.user.email.toLowerCase().includes(search.toLowerCase()) ||
      order._id.toLowerCase().includes(search.toLowerCase())
  );
  return <div className="p-6 spacy-y-6 "></div>;
};

export default OrdersPage;
