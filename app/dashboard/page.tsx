'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { walletApi } from '@/lib/api';
import { toast } from 'react-toastify';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalance = async () => {
    setIsLoading(true);
    const response = await walletApi.getBalance();
    setIsLoading(false);

    if (response.success && response.data) {
      setBalance(response.data.balance);
    } else {
      toast.error(response.error || 'Failed to fetch balance');
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your wallet and view your transactions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-3 border-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">Wallet Balance</CardTitle>
              <CardDescription>Your current available balance</CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchBalance}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white dark:text-slate-900" />
              </div>
              <div>
                <div className="text-4xl font-bold">
                  {isLoading ? (
                    <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
                  ) : (
                    formatCurrency(balance || 0)
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated just now
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-lg">Top Up Wallet</CardTitle>
            <CardDescription>
              Add money to your wallet using various payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/topup">
              <Button className="w-full">
                Add Money
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-lg">Send Money</CardTitle>
            <CardDescription>
              Transfer funds to other wallet users instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/transfer">
              <Button className="w-full" variant="outline">
                Transfer
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <CardTitle className="text-lg">Payment Gateway</CardTitle>
            <CardDescription>
              Create payment orders for your merchants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/pg">
              <Button className="w-full" variant="outline">
                Create Order
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest transactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm mt-1">Your transactions will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
