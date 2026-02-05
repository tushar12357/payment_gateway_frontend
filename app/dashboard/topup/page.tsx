'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { walletApi } from '@/lib/api';
import { toast } from 'react-toastify';
import { ArrowUpRight, CreditCard, Smartphone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loadRazorpay } from '@/lib/loadRazorpay';

const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

export default function TopUpPage() {
  const [inputAmount, setInputAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleQuickAmount = (value: number) => {
    setInputAmount(value.toString());
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = Number(inputAmount);
    if (!numAmount || numAmount < 10 || numAmount > 100000) {
      toast.error('Enter amount between ₹10 and ₹1,00,000');
      return;
    }

    setIsLoading(true);

    // 1️⃣ Create Razorpay order (backend)
    const response = await walletApi.topup(numAmount);
    setIsLoading(false);

    if (!response.success || !response.data) {
      toast.error(response.error || 'Failed to create payment order');
      return;
    }

    const {
      orderId,
      razorpayKey,
      amount: orderAmount,
      currency,
    } = response.data;

    // 2️⃣ Load Razorpay SDK
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error('Razorpay SDK failed to load');
      return;
    }

    // 3️⃣ Open Razorpay Checkout
    const options = {
      key: razorpayKey,
      order_id: orderId,
      amount: orderAmount * 100, // paise
      currency,
      name: 'Wallet Top-Up',
      description: 'Add money to wallet',

      handler: function () {
        toast.success('Payment successful 🎉');
        router.push('/dashboard');
      },

      modal: {
        ondismiss: () => {
          toast.info('Payment cancelled');
        },
      },

      theme: {
        color: '#000000',
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Top Up Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Add money to your wallet
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enter Amount</CardTitle>
            <CardDescription>
              Choose a quick amount or enter manually
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleTopUp} className="space-y-6">
              <div className="space-y-3">
                <Label>Amount (INR)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-xl">₹</span>
                  <Input
                    type="number"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    className="pl-10 h-14 text-xl"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Min ₹10 • Max ₹1,00,000
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((v) => (
                  <Button
                    key={v}
                    type="button"
                    variant={inputAmount === v.toString() ? 'default' : 'outline'}
                    onClick={() => handleQuickAmount(v)}
                    disabled={isLoading}
                  >
                    {formatCurrency(v)}
                  </Button>
                ))}
              </div>

              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading || !inputAmount}
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Add {inputAmount ? formatCurrency(Number(inputAmount)) : 'Money'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded">
                <CreditCard className="w-5 h-5" />
                <span>Cards</span>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded">
                <Smartphone className="w-5 h-5" />
                <span>UPI</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>• Instant wallet credit</p>
              <p>• Secure Razorpay payments</p>
              <p>• No hidden charges</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
