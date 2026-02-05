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

const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

export default function TopUpPage() {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (numAmount < 10) {
      toast.error('Minimum top-up amount is ₹10');
      return;
    }

    if (numAmount > 100000) {
      toast.error('Maximum top-up amount is ₹1,00,000');
      return;
    }

    setIsLoading(true);
    const response = await walletApi.topup(numAmount);
    setIsLoading(false);

    if (response.success && response.data) {
      toast.success('Payment order created successfully');
      router.push('/dashboard');
    } else {
      toast.error(response.error || 'Failed to create top-up order');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Top Up Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Add money to your wallet for seamless transactions
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-2">
          <CardHeader>
            <CardTitle>Enter Amount</CardTitle>
            <CardDescription>
              Choose a quick amount or enter a custom value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTopUp} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="amount">Amount (INR)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-2xl font-semibold text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 text-2xl h-16 font-semibold"
                    min="10"
                    max="100000"
                    step="1"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Minimum: ₹10 • Maximum: ₹1,00,000
                </p>
              </div>

              <div className="space-y-3">
                <Label>Quick Select</Label>
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={amount === value.toString() ? 'default' : 'outline'}
                      onClick={() => handleQuickAmount(value)}
                      disabled={isLoading}
                      className="h-14"
                    >
                      {formatCurrency(value)}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isLoading || !amount || parseFloat(amount) <= 0}
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                    Add {amount ? formatCurrency(parseFloat(amount)) : 'Money'}
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
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Cards</p>
                  <p className="text-xs text-muted-foreground">Credit/Debit</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">UPI</p>
                  <p className="text-xs text-muted-foreground">Pay via UPI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Instant credit to your wallet</p>
              <p>• Secure payment gateway</p>
              <p>• No hidden charges</p>
              <p>• 24/7 customer support</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
