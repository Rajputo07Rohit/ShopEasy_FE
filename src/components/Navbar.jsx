import { LogIn, ShoppingCart, User } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";
import { UserData } from "@/context/UserContext";
import { CartData } from "@/context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { logoutUser, isAuth } = UserData();

  const { totalItem, setTotalItem } = CartData();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold tracking-tight cursor-pointer hover:opacity-90 transition"
        >
          ShopEasy<span className="text-primary">Pro</span>
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-8 text-sm font-medium">
            <li
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-primary transition"
            >
              Home
            </li>

            <li
              onClick={() => navigate("/products")}
              className="cursor-pointer hover:text-primary transition"
            >
              Products
            </li>

            {/* Cart */}
            <li
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:text-primary transition" />
              <span className="absolute -top-2 -right-2 bg-red-700 text-white text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full scale-90 group-hover:scale-100 transition-transform">
                {totalItem ? totalItem : 0}
              </span>
            </li>

            {/* Account */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="p-2 rounded-full hover:bg-muted transition">
                    {isAuth ? <User className="w-5 h-5" /> : <LogIn />}
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {!isAuth ? (
                    <DropdownMenuItem onClick={() => navigate("/login")}>
                      Login
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/order")}>
                        Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          logoutUser(setTotalItem);
                          navigate("/login");
                        }}
                        className="text-red-500 focus:text-red-500"
                      >
                        Logout
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <ModeToggle />
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
