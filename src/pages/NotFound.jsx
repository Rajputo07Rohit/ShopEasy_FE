import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import notFound from "../assets/not found.png";

const NotFound = () => {
  return (
    <div className="w-[60%] m-auto flex flex-col justify-center items-center">
      <img src={notFound} alt="" />
      <Link to={"/"}>
        <Button className="cursor-pointer" variant="ghost">
          Go to <Home /> Page{" "}
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
