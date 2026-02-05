"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Wallet, Smartphone, Shield } from "lucide-react";
import { authApi } from "@/lib/api";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const [countryCode, setCountryCode] = useState("+91");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    const fullPhone = `${countryCode}${phone}`;
    const response = await authApi.sendOtp(fullPhone);
    setIsLoading(false);

    if (response.success) {
      toast.success("OTP sent successfully");
      setStep("otp");
    } else {
      toast.error(response.error || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    const fullPhone = `${countryCode}${phone}`;
    const response = await authApi.verifyOtp(fullPhone, otp);
    setIsLoading(false);

    if (response.success && response.data) {
      toast.success("Login successful");
      login(response.data.token, response.data.user);
      router.push("/dashboard");
    } else {
      toast.error(response.error || "Invalid OTP");
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 dark:bg-slate-100 mb-4">
              <Wallet className="w-8 h-8 text-white dark:text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to PayGate
            </h1>
            <p className="text-muted-foreground mt-2">
              Secure payments and wallet management
            </p>
          </div>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>
                {step === "phone" ? "Sign In" : "Verify OTP"}
              </CardTitle>
              <CardDescription>
                {step === "phone"
                  ? "Enter your phone number to receive an OTP"
                  : `Enter the 6-digit code sent to ${phone}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === "phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>

                    <div className="flex gap-2">
                      {/* Country Code */}
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        disabled={isLoading}
                        className="h-10 rounded-md border bg-background px-3 text-sm"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+61">🇦🇺 +61</option>
                      </select>

                      {/* Phone Number */}
                      <div className="relative flex-1">
                        <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Phone number"
                          value={phone}
                          onChange={(e) =>
                            setPhone(
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || phone.length < 10}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      maxLength={6}
                      disabled={isLoading}
                      autoFocus
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={handleBackToPhone}
                    disabled={isLoading}
                  >
                    Change Phone Number
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-2">
                <Shield className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <p className="text-xs text-muted-foreground">Secure</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-2">
                <Wallet className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <p className="text-xs text-muted-foreground">Fast</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-2">
                <Smartphone className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <p className="text-xs text-muted-foreground">Simple</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-slate-900 dark:bg-slate-950 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            The Modern Way to Manage Payments
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Experience seamless transactions with our secure payment gateway and
            integrated wallet system.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Bank-Level Security</h3>
                <p className="text-sm text-slate-400">
                  Your data is protected with enterprise-grade encryption
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Instant Transfers</h3>
                <p className="text-sm text-slate-400">
                  Send and receive money in seconds
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Easy Integration</h3>
                <p className="text-sm text-slate-400">
                  Simple API for merchants and developers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
