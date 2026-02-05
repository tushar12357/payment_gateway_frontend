"use client";

import { useEffect, useState } from "react";
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
import { merchantApi } from "@/lib/api";
import { toast } from "react-toastify";
import { Store, Globe, Plus, Building2, Copy, EyeOff, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MerchantsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ aligned with backend
  const [formData, setFormData] = useState({
    name: "",
    webhookUrl: "",
    website: "", // UI-only (not sent)
  });
  const [creds, setCreds] = useState<any>(null);
  const [showCreds, setShowCreds] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [showSecret, setShowSecret] = useState<string | null>(null);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    const res = await merchantApi.getAll();
    setMerchants(res.data.data);
  };

  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.webhookUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      await merchantApi.create({
        name: formData.name,
        webhookUrl: formData.webhookUrl,
      });

      toast.success("Merchant created");
      await fetchMerchants();

      setIsOpen(false);
      setFormData({ name: "", webhookUrl: "", website: "" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to create merchant");
    } finally {
      setIsLoading(false);
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merchants</h1>
          <p className="text-muted-foreground mt-2">
            Manage your merchant accounts and integrations
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Merchant
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Merchant</DialogTitle>
              <DialogDescription>
                Add a new merchant to your payment gateway
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateMerchant} className="space-y-4 mt-4">
              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter business name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Webhook URL (keeps same visual style) */}
              <div className="space-y-2">
                <Label htmlFor="email">Webhook URL *</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="url"
                    placeholder="https://merchant.com/webhook"
                    value={formData.webhookUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, webhookUrl: e.target.value })
                    }
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Website (UI only) */}
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Merchant"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty State */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {merchants.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center py-12">
              <Store className="w-8 h-8 mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No merchants yet</p>
            </CardContent>
          </Card>
        ) : (
          merchants.map((m) => (
            <Card key={m._id}>
              <CardHeader>
                <CardTitle>{m.name}</CardTitle>
                <CardDescription>{m.webhookUrl}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="capitalize text-green-600">{m.status}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>API Key</span>
                  <div className="flex items-center gap-2">
                    <code className="truncate max-w-[120px]">
                      {m.apiKey.slice(0, 10)}...
                    </code>
                    <Copy
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => copy(m.apiKey)}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>API Secret</span>
                  <div className="flex items-center gap-2">
                    <code className="truncate max-w-[120px]">
                      {showSecret === m._id
                        ? m.apiSecret
                        : "••••••••••"}
                    </code>
                    <button onClick={() =>
                      setShowSecret(showSecret === m._id ? null : m._id)
                    }>
                      {showSecret === m._id ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <Copy
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => copy(m.apiSecret)}
                    />
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Created: {new Date(m.createdAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>


      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>What is a Merchant?</CardTitle>
          <CardDescription>
            Learn about merchant accounts and how they work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Store className="w-4 h-4" />
                Merchant Account
              </h4>
              <p className="text-sm text-muted-foreground">
                A merchant account allows businesses to accept payments through
                your payment gateway. Each merchant gets unique API credentials.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Integration
              </h4>
              <p className="text-sm text-muted-foreground">
                Merchants integrate using API keys and webhooks to receive
                payment events securely.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
