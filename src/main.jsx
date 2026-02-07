import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/theme-provider";
import { UserProvider } from "./context/UserContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";

export const server = "http://localhost:3000";

export const categories = [
  // Electronics
  "smartphone",
  "laptop",
  "tablet",
  "smartwatch",
  "headphones",
  "earbuds",
  "bluetooth-speaker",
  "power-bank",
  "camera",
  "gaming-console",
  "gaming-accessories",

  // Home Appliances
  "refrigerator",
  "washing-machine",
  "air-conditioner",
  "microwave",
  "dishwasher",
  "water-purifier",
  "vacuum-cleaner",
  "mixer-grinder",
  "electric-kettle",
  "iron",

  // Fashion
  "tshirt",
  "shirt",
  "jeans",
  "trousers",
  "jacket",
  "hoodie",
  "sweatshirt",
  "kurta",
  "saree",
  "dress",
  "shorts",

  // Footwear
  "shoes",
  "sneakers",
  "sandals",
  "slippers",
  "formal-shoes",
  "sports-shoes",

  // Accessories
  "backpack",
  "handbag",
  "wallet",
  "belt",
  "sunglasses",
  "watch",
  "jewellery",

  // Furniture
  "sofa",
  "bed",
  "mattress",
  "chair",
  "table",
  "wardrobe",
  "desk",
  "bookshelf",

  // Kitchen & Dining
  "cookware",
  "dinner-set",
  "water-bottle",
  "lunch-box",
  "flask",

  // Beauty & Personal Care
  "skincare",
  "haircare",
  "makeup",
  "perfume",
  "grooming-kit",

  // Sports & Fitness
  "fitness-equipment",
  "yoga-mat",
  "dumbbells",
  "treadmill",
  "cycle",

  // Books & Stationery
  "books",
  "notebooks",
  "office-supplies",

  // Kids & Toys
  "toys",
  "baby-care",
  "school-bags",

  // Automotive
  "car-accessories",
  "bike-accessories",

  // Others
  "gift-items",
  "home-decor",
  "lighting",
];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ProductProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ProductProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>
);
