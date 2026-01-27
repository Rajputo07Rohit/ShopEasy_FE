import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, ShieldCheck } from "lucide-react";
import { UserData } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { CartData } from "@/context/CartContext";

const Verify = () => {
  const navigate = useNavigate();
  const OTP_LENGTH = 6;

  const { getCart } = CartData();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const { verifyLoading, resendOtp, verifyUser } = UserData();

  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const otpValue = otp.join("");

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        return;
      }

      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasteData) return;

    const splitOtp = pasteData.slice(0, OTP_LENGTH).split("");
    const newOtp = Array(OTP_LENGTH).fill("");

    splitOtp.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(splitOtp.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (otpValue.length !== OTP_LENGTH) return;

    verifyUser(Number(otpValue), navigate, getCart);
  };

  const resendOtpHandler = async () => {
    await resendOtp();
    setTimer(30);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* ✅ Card Wrapper */}
        <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-[0_16px_40px_rgba(0,0,0,0.10)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.45)] p-8 sm:p-10">
          {/* ✅ Brand */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              ShopEasy<span className="text-primary">Pro</span>
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Secure verification with one-time password
            </p>
          </div>

          {/* ✅ Title */}
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold">Verify OTP</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* ✅ OTP Form */}
          <form onSubmit={submitHandler} className="mt-8 space-y-6">
            <div
              className="flex justify-center gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="
                    h-12 w-12 sm:h-14 sm:w-14 
                    rounded-xl text-center text-lg font-semibold 
                    border-border bg-background
                    focus-visible:ring-2 focus-visible:ring-primary
                  "
                />
              ))}
            </div>

            {/* ✅ Button */}
            <Button
              type="submit"
              disabled={verifyLoading || otpValue.length !== OTP_LENGTH}
              className="w-full h-12 text-base font-medium rounded-xl"
            >
              {verifyLoading ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-5 w-5 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify & Continue"
              )}
            </Button>

            {/* ✅ Resend */}
            <div className="text-center text-sm text-muted-foreground">
              Didn’t receive code?
              {timer > 0 ? (
                <span className="ml-2 font-medium text-primary">
                  Resend in {timer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resendOtpHandler}
                  className="ml-2 font-semibold text-primary hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>

          {/* ✅ Bottom Help */}
          <div className="mt-6 rounded-xl border border-border bg-muted/40 px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">
              Tip: You can paste the full OTP directly into the boxes ✅
            </p>
          </div>
        </div>

        {/* ✅ Footer text */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Having trouble? Please check spam folder or try resend OTP.
        </p>
      </div>
    </div>
  );
};

export default Verify;
