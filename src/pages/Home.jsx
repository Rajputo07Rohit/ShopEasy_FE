import Hero from "@/components/Hero";
import ProductsCard from "@/components/ProductsCard";
import { ProductData } from "@/context/ProductContext";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const { loading, products, newProd } = ProductData();
  return (
    <div>
      <Hero navigate={navigate} />
      <div className="top products mt-4 p-4">
        <h1 className="text-3xl font-bold mb-4">Latest Products</h1>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newProd && newProd.length > 0 ? (
            newProd.map((e) => (
              <ProductsCard key={e._id} product={e} latest="yes" />
            ))
          ) : (
            <p className="text-muted-foreground">No Products yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
