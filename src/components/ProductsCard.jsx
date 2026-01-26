import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProductsCard = ({ product, latest }) => {
  if (!product) return null;

  const imageUrl = product?.images?.[0]?.url;
  const title = product?.title || "No Title";
  const desc = product?.description || "No Description";
  const price = product?.price || 0;

  return (
    <div className="w-full rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all overflow-hidden">
      {/* ✅ Image */}
      <Link to={`/product/${product._id}`}>
        <div className="relative bg-muted h-[220px] sm:h-[240px] md:h-[260px] overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No Image</p>
            </div>
          )}

          {/* ✅ Badge */}
          {latest === "yes" && (
            <Badge className="absolute top-3 left-3 bg-green-600 text-white border-none">
              New
            </Badge>
          )}
        </div>
      </Link>

      {/* ✅ Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold line-clamp-1">{title}</h3>

        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {desc}
        </p>

        <p className="text-sm font-medium mt-2">₹ {price}</p>

        {/* ✅ Button */}
        <div className="flex justify-center mt-4">
          <Link to={`/products`} className="w-full">
            <Button className="w-full rounded-md">View Product</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;
