import Loading from "@/components/Loading";
import ProductsCard from "@/components/ProductsCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartData } from "@/context/CartContext";
import { ProductData } from "@/context/ProductContext";
import { UserData } from "@/context/UserContext";
import { categories, server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { Edit, IndianRupee, Loader2, ShoppingCart, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { getProduct, product, relatedProduct, loading } = ProductData();
  const { addToCart } = CartData();
  const { isAuth, user } = UserData();
  const { id } = useParams();

  const [show, setShow] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [updateImage, setUpdateImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    getProduct(id);
  }, [id]);

  /* ================= EDIT TOGGLE ================= */
  const updateHandler = () => {
    setShow(!show);

    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
      });
    }
  };

  /* ================= UPDATE PRODUCT ================= */
  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        formData,
        { headers: { token: Cookies.get("token") } }
      );

      toast.success(data.message);
      getProduct(id);
      setShow(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= UPDATE IMAGE ================= */
  const handleSubmitImage = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    if (!updateImage || updateImage.length === 0) {
      toast.error("Please select new images");
      setBtnLoading(false);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < updateImage.length; i++) {
      formData.append("files", updateImage[i]);
    }

    try {
      const { data } = await axios.post(
        `${server}/api/product/${id}`,
        formData,
        { headers: { token: Cookies.get("token") } }
      );

      toast.success(data.message);
      getProduct(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Image update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ================= ADMIN EDIT PANEL ================= */}
        {user?.role === "admin" && (
          <div className="max-w-lg mx-auto mb-10">
            <Button onClick={updateHandler} variant="outline">
              {show ? <X /> : <Edit />}
            </Button>

            {show && (
              <form
                onSubmit={submitHandler}
                className="mt-6 space-y-4 border p-6 rounded-2xl bg-card shadow"
              >
                <Input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />

                <Input
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                <Input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />

                <Input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />

                <select
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                <Button type="submit" disabled={btnLoading} className="w-full">
                  {btnLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Update Product"
                  )}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* ================= MAIN PRODUCT SECTION ================= */}
        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            {/* IMAGE */}
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <Carousel>
                <CarouselContent>
                  {product.images?.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="flex items-center justify-center h-96">
                        <img
                          src={image.url}
                          alt="product"
                          className="max-h-full object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              {user?.role === "admin" && (
                <form
                  onSubmit={handleSubmitImage}
                  className="mt-6 flex flex-col gap-3"
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setUpdateImage(e.target.files)}
                  />
                  <Button type="submit" disabled={btnLoading}>
                    {btnLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Update Images"
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* DETAILS */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <p className="text-muted-foreground">{product.description}</p>

              <div className="flex items-center gap-2 text-4xl font-bold text-primary">
                <IndianRupee className="h-6 w-6" />
                {product.price}
              </div>

              {product.stock <= 0 ? (
                <p className="text-red-500 font-semibold">Out of Stock</p>
              ) : (
                <p className="text-green-600">In Stock ({product.stock})</p>
              )}

              {isAuth ? (
                <Button
                  disabled={product.stock <= 0}
                  onClick={() => addToCart(id)}
                  className="h-12 rounded-xl flex items-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
              ) : (
                <p className="text-primary">Please login to purchase</p>
              )}

              <div className="border rounded-xl p-4 bg-muted/40 text-sm">
                ✔ Secure Payment <br />
                ✔ 7-Day Replacement <br />✔ Fast Delivery
              </div>
            </div>
          </div>
        )}

        {/* ================= RELATED ================= */}
        {relatedProduct?.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProduct.map((p) => (
                <ProductsCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
