import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              ShopEasy<span className="text-primary">Pro</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Your trusted destination for premium quality products, delivered
              fast and securely.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm">
            {[
              "About Us",
              "Contact",
              "Privacy Policy",
              "Terms & Conditions",
            ].map((item) => (
              <a key={item} href="#" className="hover:text-primary transition">
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ShopEasyPro. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2 rounded-full hover:bg-muted transition"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
