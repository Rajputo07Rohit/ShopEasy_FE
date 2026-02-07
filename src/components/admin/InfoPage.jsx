import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  Label,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ================= SAFE CHART CONFIG ================= */
const paymentChartConfig = {
  Online: {
    label: "Online",
    color: "#6366f1", // Indigo
  },
  COD: {
    label: "COD",
    color: "#ec4899", // Pink
  },
};

const InfoPage = () => {
  const [cod, setCod] = useState(0);
  const [online, setOnline] = useState(0);
  const [productData, setProductData] = useState([]);

  /* ================= FETCH STATS ================= */
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(`${server}/api/stats`, {
          headers: { token: Cookies.get("token") },
        });

        setCod(data?.cod ?? 0);
        setOnline(data?.online ?? 0);
        setProductData(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };

    fetchStatus();
  }, []);

  /* ================= DERIVED DATA ================= */
  const totalUsers = cod + online;

  const paymentData = useMemo(
    () => [
      { method: "Online", users: online },
      { method: "COD", users: cod },
    ],
    [online, cod]
  );

  const paymentPercentage = useMemo(() => {
    return paymentData.map((p) => ({
      method: p.method,
      percentage:
        totalUsers === 0
          ? 0
          : Number(((p.users / totalUsers) * 100).toFixed(2)),
    }));
  }, [paymentData, totalUsers]);

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Insights about payments and product performance
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All payment users</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{totalUsers}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online Payments</CardTitle>
            <CardDescription>Users paid online</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-indigo-600">
            {online}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>COD Payments</CardTitle>
            <CardDescription>Cash on delivery</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-pink-600">
            {cod}
          </CardContent>
        </Card>
      </div>

      {/* ================= PIE CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== PAYMENT COUNT ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>User distribution</CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer
              config={paymentChartConfig}
              className="mx-auto aspect-square max-h-[280px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={paymentData}
                  dataKey="users"
                  nameKey="method"
                  innerRadius={65}
                  strokeWidth={4}
                >
                  {paymentData.map((entry) => (
                    <Cell
                      key={entry.method}
                      fill={paymentChartConfig[entry.method].color}
                    />
                  ))}

                  <Label
                    content={({ viewBox }) =>
                      viewBox && (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-muted-foreground text-lg font-semibold"
                        >
                          {totalUsers} Users
                        </text>
                      )
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>

          <CardFooter className="text-sm text-muted-foreground">
            Total users grouped by payment type
          </CardFooter>
        </Card>

        {/* ===== PAYMENT PERCENTAGE ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Percentage</CardTitle>
            <CardDescription>Relative distribution</CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer
              config={paymentChartConfig}
              className="mx-auto aspect-square max-h-[280px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={paymentPercentage}
                  dataKey="percentage"
                  nameKey="method"
                  innerRadius={65}
                  strokeWidth={4}
                >
                  {paymentPercentage.map((entry) => (
                    <Cell
                      key={entry.method}
                      fill={paymentChartConfig[entry.method].color}
                    />
                  ))}

                  <Label
                    content={({ viewBox }) =>
                      viewBox && (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-muted-foreground text-lg font-semibold"
                        >
                          100%
                        </text>
                      )
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>

          <CardFooter className="text-sm text-muted-foreground">
            Percentage split of payment methods
          </CardFooter>
        </Card>
      </div>

      {/* ================= PRODUCT SALES ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Product Sales</CardTitle>
          <CardDescription>Units sold per product</CardDescription>
        </CardHeader>

        <CardContent className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground">
          Hover over a bar to see the product details
        </CardFooter>
      </Card>
    </div>
  );
};

export default InfoPage;
