import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Loader, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");

  const { loginUser, loginLoading } = UserData();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, navigate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* ✅ Card Wrapper */}
        <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-[0_16px_40px_rgba(0,0,0,0.10)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.45)] p-8 sm:p-10">
          {/* ✅ Brand */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted">
              <Mail className="h-6 w-6 text-primary" />
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              ShopEasy<span className="text-primary">Pro</span>
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Secure login with one-time password
            </p>
          </div>

          {/* ✅ Title */}
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold">Sign in to your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we’ll send you a secure one-time login code.
            </p>
          </div>

          {/* ✅ Form */}
          <form onSubmit={submitHandler} className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-border bg-background focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loginLoading || !email}
              className="w-full h-12 text-base font-medium rounded-xl"
            >
              {loginLoading ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-5 w-5 animate-spin" />
                  Sending OTP...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          {/* ✅ Bottom text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have a code?
            <button
              type="button"
              onClick={() => navigate("/verify")}
              className="ml-2 font-semibold text-primary hover:underline"
            >
              Verify OTP
            </button>
          </div>
        </div>

        {/* ✅ Footer Help */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Make sure your email is correct. Check spam folder if OTP is not
          received.
        </p>
      </div>
    </div>
  );
};

export default Login;
