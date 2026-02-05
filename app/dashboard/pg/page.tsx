'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pgApi } from '@/lib/api';
import { toast } from 'react-toastify';
import { CreditCard, User, Mail, Smartphone, Link as LinkIcon, DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PGPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'INR',
    orderId: '',
    customerId: '',
    customerPhone: '',
    customerEmail: '',
    callbackUrl: '',
  });

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD${timestamp}${random}`;
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!formData.orderId) {
      toast.error('Please enter an order ID');
      return;
    }

    if (!formData.customerId) {
      toast.error('Please enter a customer ID');
      return;
    }

    if (!formData.callbackUrl) {
      toast.error('Please enter a callback URL');
      return;
    }

    setIsLoading(true);
    const response = await pgApi.createOrder({
      amount: numAmount,
      currency: formData.currency,
      orderId: formData.orderId,
      customerId: formData.customerId,
      customerPhone: formData.customerPhone || undefined,
      customerEmail: formData.customerEmail || undefined,
      callbackUrl: formData.callbackUrl,
    });
    setIsLoading(false);

    if (response.success) {
      toast.success('Payment order created successfully');
      setFormData({
        amount: '',
        currency: 'INR',
        orderId: '',
        customerId: '',
        customerPhone: '',
        customerEmail: '',
        callbackUrl: '',
      });
    } else {
      toast.error(response.error || 'Failed to create order');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Gateway</h1>
        <p className="text-muted-foreground mt-2">
          Create payment orders for merchant transactions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-2">
          <CardHeader>
            <CardTitle>Create Payment Order</CardTitle>
            <CardDescription>
              Generate a new payment order for processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrder} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="pl-10"
                      step="0.01"
                      min="1"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currency: value })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID *</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="orderId"
                      placeholder="Enter order ID"
                      value={formData.orderId}
                      onChange={(e) =>
                        setFormData({ ...formData, orderId: e.target.value })
                      }
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({ ...formData, orderId: generateOrderId() })
                    }
                    disabled={isLoading}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customerId"
                    placeholder="Enter customer ID"
                    value={formData.customerId}
                    onChange={(e) =>
                      setFormData({ ...formData, customerId: e.target.value })
                    }
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="customerPhone"
                      type="tel"
                      placeholder="Optional"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, customerPhone: e.target.value })
                      }
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="Optional"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="callbackUrl">Callback URL *</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="callbackUrl"
                    type="url"
                    placeholder="https://yoursite.com/callback"
                    value={formData.callbackUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, callbackUrl: e.target.value })
                    }
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  URL to receive payment status updates
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={
                  isLoading ||
                  !formData.amount ||
                  !formData.orderId ||
                  !formData.customerId ||
                  !formData.callbackUrl
                }
              >
                {isLoading ? 'Creating Order...' : 'Create Payment Order'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="font-medium mb-1">Amount</p>
                <p className="text-2xl font-bold">
                  {formData.amount
                    ? `${formData.currency} ${parseFloat(formData.amount).toFixed(2)}`
                    : '---'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-medium break-all">
                  {formData.orderId || 'Not set'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Customer ID</p>
                <p className="font-medium break-all">
                  {formData.customerId || 'Not set'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">API Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Merchant verification required</p>
              <p>• Idempotency key supported</p>
              <p>• Webhook notifications</p>
              <p>• Secure signature validation</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
