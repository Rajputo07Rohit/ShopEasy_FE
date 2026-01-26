import Loading from "@/components/Loading";
import ProductsCard from "@/components/ProductsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductData } from "@/context/ProductContext";
import { Filter, X, Search, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";

const Products = () => {
  const [show, setShow] = useState(false);

  const {
    loading,
    products,
    search,
    setSearch,
    categories,
    category,
    setCategory,
    totalPages,
    price,
    setPrice,
    page,
    setPage,
  } = ProductData();

  const clearFilter = () => {
    setPrice("");
    setCategory("");
    setSearch("");
    setPage(1);
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        {/* ✅ Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Products
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse & filter products easily
            </p>
          </div>

          {/* ✅ Mobile Filter Button */}
          <Button
            variant="outline"
            className="md:hidden rounded-xl"
            onClick={() => setShow(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* ✅ Layout */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          {/* ✅ Sidebar (Desktop) */}
          <div className="hidden md:block">
            <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                  Filters
                </h2>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={clearFilter}
                >
                  Clear
                </Button>
              </div>

              {/* Search */}
              <div className="mt-5 space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-11 rounded-xl bg-background border-border"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mt-5 space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories?.map((e) => (
                    <option value={e} key={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="mt-5 space-y-2">
                <label className="text-sm font-medium">Sort by Price</label>
                <select
                  className="w-full h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="lowToHigh">Low to High</option>
                  <option value="HighToLow">High to Low</option>
                </select>
              </div>

              <Button className="mt-6 w-full rounded-xl" onClick={clearFilter}>
                Reset Filters
              </Button>
            </div>
          </div>

          {/* ✅ Mobile Filter Drawer */}
          {show && (
            <div className="fixed inset-0 z-50 md:hidden">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShow(false)}
              />

              {/* Drawer */}
              <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-card border-r border-border p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    Filters
                  </h2>

                  <button
                    onClick={() => setShow(false)}
                    className="rounded-xl border border-border bg-muted p-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="mt-5 space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-11 rounded-xl bg-background border-border"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mt-5 space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories?.map((e) => (
                      <option value={e} key={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="mt-5 space-y-2">
                  <label className="text-sm font-medium">Sort by Price</label>
                  <select
                    className="w-full h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="lowToHigh">Low to High</option>
                    <option value="HighToLow">High to Low</option>
                  </select>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={clearFilter}
                  >
                    Clear
                  </Button>
                  <Button
                    className="w-full rounded-xl"
                    onClick={() => setShow(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Products Grid */}
          <div>
            {/* Top Bar */}
            <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm p-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {products?.length || 0}
                </span>{" "}
                products
              </p>

              <Button
                variant="outline"
                className="rounded-xl"
                onClick={clearFilter}
              >
                Clear Filters
              </Button>
            </div>

            {/* Products */}
            {loading ? (
              <div className="mt-6">
                <Loading />
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products && products.length > 0 ? (
                  products.map((e) => (
                    <ProductsCard key={e._id} product={e} latest="no" />
                  ))
                ) : (
                  <div className="rounded-2xl border border-border bg-card p-10 text-center">
                    <p className="text-muted-foreground">
                      No products found 😢
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 rounded-xl"
                      onClick={clearFilter}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {page !== 1 && (
                      <PaginationItem
                        className="cursor-pointer"
                        onClick={prevPage}
                      >
                        <PaginationPrevious />
                      </PaginationItem>
                    )}

                    {page !== totalPages && (
                      <PaginationItem
                        className="cursor-pointer"
                        onClick={nextPage}
                      >
                        <PaginationNext />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
