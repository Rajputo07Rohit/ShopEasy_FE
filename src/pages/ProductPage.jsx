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
import { CartData } from "@/context/CartContext";
import { ProductData } from "@/context/ProductContext";
import { UserData } from "@/context/UserContext";
import { IndianRupee, ShoppingCart } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { getProduct, product, relatedProduct, loading } = ProductData();
  const { addToCart } = CartData();
  const { isAuth } = UserData();
  const { id } = useParams();

  useEffect(() => {
    getProduct(id);
  }, [id]);

  const addToCartHandler = () => {
    addToCart(id);
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* ================= IMAGE SECTION ================= */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <Carousel className="relative">
                <CarouselContent>
                  {product.images?.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="flex items-center justify-center h-80 sm:h-95">
                        <img
                          src={image.url}
                          alt={`product-${index}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* ================= DETAILS SECTION ================= */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {product.title}
                </h1>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 text-3xl font-bold">
                <IndianRupee className="h-6 w-6" />
                {product.price}
              </div>

              {/* Stock */}
              {product.stock <= 0 ? (
                <p className="text-red-500 font-semibold text-lg">
                  Out of Stock
                </p>
              ) : (
                <p className="text-green-600 font-medium">
                  In Stock ({product.stock} available)
                </p>
              )}

              {/* CTA */}
              {isAuth ? (
                <Button
                  disabled={product.stock <= 0}
                  onClick={addToCartHandler}
                  className="h-12 px-6 rounded-xl text-base flex items-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
              ) : (
                <p className="text-primary font-medium">
                  Please login to add this product to cart
                </p>
              )}

              {/* Extra Info */}
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                ✔ Secure payment <br />
                ✔ 7-day replacement policy <br />✔ Fast delivery available
              </div>
            </div>
          </div>
        )}

        {/* ================= RELATED PRODUCTS ================= */}
        {relatedProduct?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProduct.map((e) => (
                <ProductsCard key={e._id} product={e} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
