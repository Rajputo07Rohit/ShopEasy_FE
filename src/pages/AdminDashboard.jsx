import HomePage from "@/components/admin/HomePage";
import InfoPage from "@/components/admin/InfoPage";
import OrdersPage from "@/components/admin/OrdersPage";
import { Button } from "@/components/ui/button";
import { UserData } from "@/context/UserContext";
import {
  Home,
  Info,
  Menu,
  ShoppingBag,
  X,
  LayoutDashboard,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NAVBAR_HEIGHT = "top-16";

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { user, loading } = UserData();

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) return null; // or spinner

  /* ================= PAGE RENDER ================= */
  const renderPageContent = () => {
    switch (selectedPage) {
      case "home":
        return <HomePage />;
      case "order":
        return <OrdersPage />;
      case "info":
        return <InfoPage />;
      default:
        return <HomePage />;
    }
  };

  const NavButton = ({ icon: Icon, label, value }) => (
    <button
      onClick={() => {
        setSelectedPage(value);
        setSidebarOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
        ${
          selectedPage === value
            ? "bg-primary text-primary-foreground shadow"
            : "hover:bg-muted"
        }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed ${NAVBAR_HEIGHT} bottom-0 left-0 z-40 w-72
          bg-background/80 backdrop-blur-xl
          border-r
          transform transition-transform duration-300
          overflow-y-auto
          lg:relative lg:top-0 lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex flex-col gap-2">
            <NavButton icon={Home} label="Dashboard" value="home" />
            <NavButton icon={ShoppingBag} label="Orders" value="order" />
            <NavButton icon={Info} label="Info" value="info" />
          </nav>

          <div className="mt-auto pt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} ShopEasyPro
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col pt-16 lg:pt-0">
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b bg-background/70 backdrop-blur">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <h2 className="text-lg font-semibold">
            {selectedPage === "home" && "Dashboard"}
            {selectedPage === "order" && "Orders"}
            {selectedPage === "info" && "Info"}
          </h2>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{renderPageContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
