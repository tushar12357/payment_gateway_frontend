"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { DollarSign, CreditCard, KeyRound, ShieldCheck } from "lucide-react";
import { pgApi } from "@/lib/api";

export default function PGPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const generateOrderId = () => {
    const ts = Date.now();
    const rnd = Math.floor(Math.random() * 10000);
    setOrderId(`ORD_${ts}_${rnd}`);
  };

  const generateIdempotencyKey = () => {
    crypto.randomUUID
      ? setIdempotencyKey(crypto.randomUUID())
      : setIdempotencyKey(`idem_${Date.now()}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      toast.error("Invalid amount");
      return;
    }

    if (!orderId || !idempotencyKey || !apiKey || !apiSecret) {
      toast.error("Missing required fields");
      return;
    }

    const body = {
      orderId,
      amount: numAmount,
    };

 
    setIsLoading(true);

    try {
      const res = await pgApi.createOrder(body, {
        headers: {
          "x-api-key": apiKey,
          "x-signature": apiSecret,
          "idempotency-key": idempotencyKey,
        },
      });

      toast.success("Order created successfully");
      console.log(res);

      setAmount("");
      setOrderId("");
      setIdempotencyKey("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create PG Order</CardTitle>
          <CardDescription>
            Sends <code>x-api-key</code>, <code>x-signature</code> &
            <code> idempotency-key</code> in headers
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="1"
                  className="pl-9"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Order ID */}
            <div className="space-y-2">
              <Label>Order ID</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateOrderId}
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* Idempotency Key */}
            <div className="space-y-2">
              <Label>Idempotency Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={idempotencyKey}
                    onChange={(e) => setIdempotencyKey(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateIdempotencyKey}
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* API Secret (Signature) */}
            <div className="space-y-2">
              <Label>API Secret (Signature)</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  className="pl-9"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Order"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
