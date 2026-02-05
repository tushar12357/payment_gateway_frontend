'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { DollarSign, CreditCard } from 'lucide-react';
import { pgApi } from '@/lib/api';

export default function PGPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [orderId, setOrderId] = useState('');

  const generateOrderId = () => {
    const ts = Date.now();
    const rnd = Math.floor(Math.random() * 10000);
    setOrderId(`ORD_${ts}_${rnd}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Invalid amount');
      return;
    }

    if (!orderId) {
      toast.error('Order ID is required');
      return;
    }

    setIsLoading(true);
    try {
      const res = await pgApi.createOrder({
        amount: numAmount,
        orderId,
      });

      toast.success('Order created');
      console.log(res);

      setAmount('');
      setOrderId('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create order');
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
            Matches backend: <code>orderId</code> + <code>amount</code>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="1"
                  step="1"
                  className="pl-9"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

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
                <Button type="button" variant="outline" onClick={generateOrderId}>
                  Generate
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Order'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
