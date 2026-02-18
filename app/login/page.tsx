// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Wallet, Smartphone, Shield, Mail } from "lucide-react";
// import { authApi } from "@/lib/api";
// import { toast } from "react-toastify";
// import { useAuth } from "@/contexts/AuthContext";

// export default function LoginPage() {
//   const router = useRouter();
//   const { login } = useAuth();

//   // 🔹 Login method
//   const [method, setMethod] = useState<"email" | "phone">("email");

//   // 🔹 Inputs
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [countryCode, setCountryCode] = useState("+91");

//   // 🔹 UI state
//   const [step, setStep] = useState<"identifier" | "otp">("identifier");
//   const [isLoading, setIsLoading] = useState(false);

//   /* ================= SEND OTP ================= */
//   const handleSendOtp = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setIsLoading(true);

//     let response;

//     try {
//       if (method === "email") {
//         if (!email || !email.includes("@")) {
//           toast.error("Enter a valid email");
//           setIsLoading(false);
//           return;
//         }

//         response = await authApi.sendEmailOtp(email);
//       } else {
//         if (phone.length < 10) {
//           toast.error("Enter valid phone number");
//           setIsLoading(false);
//           return;
//         }

//         response = await authApi.sendOtp(`${countryCode}${phone}`);
//       }

//       if (response.success) {
//         toast.success("OTP sent successfully");
//         setStep("otp");
//       } else {
//         toast.error(response.error || "Failed to send OTP");
//       }
//     } catch {
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* ================= VERIFY OTP ================= */
//   const handleVerifyOtp = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (otp.length !== 6) {
//       toast.error("Enter valid 6-digit OTP");
//       return;
//     }

//     setIsLoading(true);

//     let response;

//     try {
//       if (method === "email") {
//         response = await authApi.verifyEmailOtp(email, otp);
//       } else {
//         response = await authApi.verifyOtp(
//           `${countryCode}${phone}`,
//           otp
//         );
//       }

//       if (response.success && response.data) {
//         toast.success("Login successful");
//         login(response.data.token, response.data.user);
//         router.push("/dashboard");
//       } else {
//         toast.error(response.error || "Invalid OTP");
//       }
//     } catch {
//       toast.error("OTP verification failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const reset = () => {
//     setStep("identifier");
//     setOtp("");
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* LEFT */}
//       <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
//         <div className="w-full max-w-md">

//           {/* Logo */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 dark:bg-slate-100 mb-4">
//               <Wallet className="w-8 h-8 text-white dark:text-slate-900" />
//             </div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               Welcome to PayGate
//             </h1>
//             <p className="text-muted-foreground mt-2">
//               Secure payments and wallet management
//             </p>
//           </div>

//           {/* Card */}
//           <Card className="border-2 shadow-lg">
//             <CardHeader>
//               <CardTitle>
//                 {step === "identifier" ? "Sign In" : "Verify OTP"}
//               </CardTitle>
//               <CardDescription>
//                 {step === "identifier"
//                   ? "Login using email or phone number"
//                   : "Enter the 6-digit OTP"}
//               </CardDescription>
//             </CardHeader>

//             <CardContent>
//               {/* Toggle */}
//               <div className="grid grid-cols-2 gap-2 mb-4">
//                 <Button
//                   type="button"
//                   variant={method === "email" ? "default" : "outline"}
//                   onClick={() => setMethod("email")}
//                 >
//                   <Mail className="w-4 h-4 mr-2" /> Email
//                 </Button>
//                 <Button
//                   type="button"
//                   variant={method === "phone" ? "default" : "outline"}
//                   onClick={() => setMethod("phone")}
//                 >
//                   <Smartphone className="w-4 h-4 mr-2" /> Phone
//                 </Button>
//               </div>

//               {/* STEP 1 */}
//               {step === "identifier" ? (
//                 <form onSubmit={handleSendOtp} className="space-y-4">
//                   {method === "email" ? (
//                     <>
//                       <Label>Email Address</Label>
//                       <Input
//                         type="email"
//                         placeholder="you@example.com"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         disabled={isLoading}
//                       />
//                     </>
//                   ) : (
//                     <>
//                       <Label>Phone Number</Label>
//                       <div className="flex gap-2">
//                         <select
//                           value={countryCode}
//                           onChange={(e) => setCountryCode(e.target.value)}
//                           className="h-10 rounded-md border px-3"
//                         >
//                           <option value="+91">🇮🇳 +91</option>
//                           <option value="+1">🇺🇸 +1</option>
//                           <option value="+44">🇬🇧 +44</option>
//                         </select>
//                         <Input
//                           type="tel"
//                           placeholder="Phone number"
//                           value={phone}
//                           onChange={(e) =>
//                             setPhone(
//                               e.target.value.replace(/\D/g, "").slice(0, 10)
//                             )
//                           }
//                         />
//                       </div>
//                     </>
//                   )}

//                   <Button className="w-full" disabled={isLoading}>
//                     {isLoading ? "Sending..." : "Send OTP"}
//                   </Button>
//                 </form>
//               ) : (
//                 /* STEP 2 */
//                 <form onSubmit={handleVerifyOtp} className="space-y-4">
//                   <Label>OTP</Label>
//                   <Input
//                     type="text"
//                     value={otp}
//                     maxLength={6}
//                     autoFocus
//                     className="text-center text-2xl tracking-widest"
//                     onChange={(e) =>
//                       setOtp(e.target.value.replace(/\D/g, ""))
//                     }
//                   />
//                   <Button className="w-full" disabled={isLoading}>
//                     {isLoading ? "Verifying..." : "Verify OTP"}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     className="w-full"
//                     onClick={reset}
//                   >
//                     Change {method === "email" ? "Email" : "Phone"}
//                   </Button>
//                 </form>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* RIGHT */}
//       <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center p-12">
//         <div className="max-w-lg text-white">
//           <h2 className="text-4xl font-bold mb-6">
//             The Modern Way to Manage Payments
//           </h2>
//           <p className="text-lg text-slate-300 mb-8">
//             Seamless transactions with secure authentication
//           </p>
//           <div className="space-y-4">
//             <Feature icon={Shield} title="Bank-Level Security" />
//             <Feature icon={Wallet} title="Instant Wallet Creation" />
//             <Feature icon={Smartphone} title="Email & Phone Login" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* Feature Item */
// function Feature({ icon: Icon, title }: any) {
//   return (
//     <div className="flex items-center gap-4">
//       <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
//         <Icon className="w-4 h-4" />
//       </div>
//       <p className="text-sm text-slate-300">{title}</p>
//     </div>
//   );
// }

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
import { Wallet, Shield } from "lucide-react";
import { authApi } from "@/lib/api";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login(email, password);

        toast.success("Login successful");
        login(response.token, response.user);
        router.push("/dashboard");
     
    } catch {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="flex-1 flex items-center justify-center p-8 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md">
          {/* Logo */}
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

          {/* Card */}
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Login using your email and password
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
               

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don’t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-slate-900 dark:text-white font-medium hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            The Modern Way to Manage Payments
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Seamless transactions with secure authentication
          </p>
          <div className="space-y-4">
            <Feature icon={Shield} title="Bank-Level Security" />
            <Feature icon={Wallet} title="Instant Wallet Creation" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-sm text-slate-300">{title}</p>
    </div>
  );
}
