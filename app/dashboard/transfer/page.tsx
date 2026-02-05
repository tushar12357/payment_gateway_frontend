'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { walletApi } from '@/lib/api';
import { toast } from 'react-toastify';
import { ArrowDownLeft, Smartphone, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TransferPage() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBalance, setIsFetchingBalance] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBalance = async () => {
      setIsFetchingBalance(true);
      const response = await walletApi.getBalance();
      setIsFetchingBalance(false);

      if (response.success && response.data) {
        setBalance(response.data.balance);
      }
    };

    fetchBalance();
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (numAmount < 1) {
      toast.error('Minimum transfer amount is ₹1');
      return;
    }

    if (balance !== null && numAmount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsLoading(true);
    const response = await walletApi.transfer(phone, numAmount, note || undefined);
    setIsLoading(false);

    if (response.success) {
      toast.success('Money transferred successfully');
      router.push('/dashboard');
    } else {
      toast.error(response.error || 'Transfer failed');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
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
          <h1 className="text-3xl font-bold tracking-tight">Transfer Money</h1>
          <p className="text-muted-foreground mt-2">
            Send money instantly to any wallet user
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-2">
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
            <CardDescription>
              Enter recipient details and transfer amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTransfer} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Recipient Phone Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-11"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (INR)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-lg font-semibold text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 text-lg h-12"
                    min="1"
                    step="0.01"
                    disabled={isLoading}
                  />
                </div>
                {balance !== null && (
                  <p className="text-sm text-muted-foreground">
                    Available balance: {formatCurrency(balance)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add a note for this transaction"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="resize-none"
                  rows={3}
                  disabled={isLoading}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {note.length}/200
                </p>
              </div>

              {amount && parseFloat(amount) > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You are about to transfer {formatCurrency(parseFloat(amount))} to {phone || 'the recipient'}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isLoading || !phone || !amount || parseFloat(amount) <= 0 || isFetchingBalance}
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    <ArrowDownLeft className="w-5 h-5 mr-2" />
                    Transfer {amount ? formatCurrency(parseFloat(amount)) : 'Money'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                {isFetchingBalance ? (
                  <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
                ) : (
                  <div className="text-3xl font-bold">
                    {balance !== null ? formatCurrency(balance) : '---'}
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Available to transfer
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transfer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Instant transfer</p>
              <p>• No transaction fees</p>
              <p>• Secure and encrypted</p>
              <p>• Available 24/7</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
