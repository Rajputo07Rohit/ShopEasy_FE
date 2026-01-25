import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, ArrowRight } from "lucide-react";

const ProductsCard = ({ product, latest }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const imageUrl = product?.images?.[0]?.url;
  const title = product?.title || "No Title";
  const desc = product?.description || "No Description";
  const price = product?.price || 0;

  return (
    <div className="group rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* ✅ Image */}
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative w-full aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <p className="text-sm text-muted-foreground">No Image</p>
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
      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold leading-tight line-clamp-1">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">{desc}</p>

        {/* ✅ Price */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-lg font-bold flex items-center gap-1">
            <IndianRupee className="h-4 w-4" />
            {price}
          </p>

          <Button
            size="sm"
            className="rounded-xl"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            View <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;
