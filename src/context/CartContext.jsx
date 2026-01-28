import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const token = Cookies.get("token");

  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [cart, setCart] = useState([]);

  const getCart = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/cart/all`, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      setCart(data.cart);
      setTotalItem(data.sumOfQuantities);
      setSubTotal(data.subTotal);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const { data } = await axios.post(
        `${server}/api/cart/add`,
        { product: productId },
        { headers: { token } }
      );

      toast.success(data.message);

      // 🔥 OPTIMISTIC UPDATE
      setTotalItem((prev) => prev + 1);

      // Optional: update subtotal if backend sends price
      if (data.price) {
        setSubTotal((prev) => prev + data.price);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const updateCart = async (action, id) => {
    try {
      const { data } = await axios.post(
        `${server}/api/cart/update?action=${action}`,
        { id },
        {
          headers: { token },
        }
      );

      getCart();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const removeCart = async (id) => {
    try {
      const { data } = await axios.get(`${server}/api/cart/remove/${id}`, {
        headers: { token },
      });

      toast.success(data.message);
      getCart();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItem,
        setTotalItem,
        subTotal,
        loading,
        getCart,
        addToCart,
        updateCart,
        removeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const CartData = () => useContext(CartContext);
