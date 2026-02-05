import { Copy, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

function CredentialsModal({
  open,
  onClose,
  credentials,
}: {
  open: boolean;
  onClose: () => void;
  credentials: { apiKey: string; apiSecret: string } | null;
}) {
  if (!credentials) return null;

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Merchant API Credentials</DialogTitle>
          <DialogDescription>
            Save these credentials now. They will not be shown again.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="rounded-lg border p-4 space-y-2">
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input readOnly value={credentials.apiKey} />
              <Button variant="outline" onClick={() => copy(credentials.apiKey)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <Label>API Secret</Label>
            <div className="flex gap-2">
              <Input readOnly value={credentials.apiSecret} />
              <Button
                variant="outline"
                onClick={() => copy(credentials.apiSecret)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-destructive">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            <span>
              This secret cannot be recovered. Rotate credentials if lost.
            </span>
          </div>

          <Button className="w-full" onClick={onClose}>
            I’ve Saved These Credentials
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
