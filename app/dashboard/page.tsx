'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { walletApi } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

type Transaction = {
  _id: string;
  amount: number;
  type: 'credit' | 'debit';
  purpose: string;
  status: string;
  note?: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);

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

  const fetchTransactions = async () => {
    setTxLoading(true);
    const response = await walletApi.getTransactions({
      limit: 5,
      status: 'success',
    });
    setTxLoading(false);

    if (response.success && response.data) {
      setTransactions(response.data.transactions);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your wallet and view your transactions
        </p>
      </div>

      {/* WALLET + ACTIONS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* WALLET BALANCE */}
        <Card className="md:col-span-2 lg:col-span-3 border-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">
                Wallet Balance
              </CardTitle>
              <CardDescription>Your current available balance</CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchBalance}
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
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

        {/* TOPUP */}
        <Card className="border-2">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Top Up Wallet</CardTitle>
            <CardDescription>Add money to your wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/topup">
              <Button className="w-full">Add Money</Button>
            </Link>
          </CardContent>
        </Card>

        {/* TRANSFER */}
        <Card className="border-2">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Send Money</CardTitle>
            <CardDescription>Transfer funds instantly</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/transfer">
              <Button className="w-full" variant="outline">
                Transfer
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* PG */}
        <Card className="border-2">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Payment Gateway</CardTitle>
            <CardDescription>Create payment orders</CardDescription>
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

      {/* RECENT ACTIVITY */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="py-6 text-center text-muted-foreground">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    {tx.type === 'credit' ? (
                      <ArrowUpRight className="text-green-600" />
                    ) : (
                      <ArrowDownLeft className="text-red-600" />
                    )}
                    <div>
                      <p className="font-medium capitalize">
                        {tx.purpose.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      tx.type === 'credit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
