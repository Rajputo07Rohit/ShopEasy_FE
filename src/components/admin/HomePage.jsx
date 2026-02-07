import { ProductData } from "@/context/ProductContext";
import React, { useMemo, useState } from "react";
import Loading from "../Loading";
import ProductsCard from "../ProductsCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Plus, ChevronDown, Loader2 } from "lucide-react";
import { categories, server } from "@/main";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

const HomePage = () => {
  const { products, page, setPage, loading, totalPages, getProducts } =
    ProductData();

  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [submitting, setSubmitting] = useState(false); // ✅ button loader

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    images: null,
  });

  /* ================= FILTERED CATEGORIES ================= */
  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categorySearch]);

  /* ================= PAGINATION ================= */
  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  /* ================= SUBMIT ================= */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.images || formData.images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const myForm = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        Array.from(value).forEach((file) => myForm.append("files", file));
      } else {
        myForm.append(key, value);
      }
    });

    try {
      setSubmitting(true);

      const { data } = await axios.post(`${server}/api/product/new`, myForm, {
        headers: {
          token: Cookies.get("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message || "Product added successfully");

      /* ✅ RESET FORM */
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        images: null,
      });

      setOpen(false);

      /* ✅ REFETCH PRODUCTS */
      await getProducts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage all products in your store
          </p>
        </div>

        <Button
          className="rounded-xl flex items-center gap-2"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        {loading ? (
          <Loading />
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductsCard key={product._id} product={product} latest="no" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            No products available
          </div>
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem onClick={prevPage}>
                  <PaginationPrevious />
                </PaginationItem>
              )}
              {page < totalPages && (
                <PaginationItem onClick={nextPage}>
                  <PaginationNext />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ================= ADD PRODUCT MODAL ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Product</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitHandler} className="grid gap-4 mt-4">
            <Input
              name="title"
              placeholder="Product Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <Input
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            {/* ================= CATEGORY ================= */}
            <div className="relative">
              <label className="text-sm font-medium text-muted-foreground">
                Category
              </label>

              <button
                type="button"
                onClick={() => setCategoryOpen((p) => !p)}
                className="mt-1 w-full h-11 px-3 rounded-md border flex justify-between items-center bg-background"
              >
                <span
                  className={formData.category ? "" : "text-muted-foreground"}
                >
                  {formData.category || "Select Category"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>

              {categoryOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover shadow-xl">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search category..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto">
                    {filteredCategories.length ? (
                      filteredCategories.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setFormData((p) => ({ ...p, category: c }));
                            setCategoryOpen(false);
                            setCategorySearch("");
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-muted"
                        >
                          {c}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-muted-foreground">
                        No category found
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ================= PRICE & STOCK ================= */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <Input
                name="stock"
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* ================= ACTIONS ================= */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Product"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
