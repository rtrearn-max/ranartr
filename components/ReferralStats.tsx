import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Copy, Check, TrendingUp, Share2 } from 'lucide-react';
import { SiWhatsapp, SiFacebook } from 'react-icons/si';
import { useState } from 'react';

interface ReferralStatsProps {
  referralCode: string;
  totalReferrals: number;
  totalEarned: number;
  recentReferrals?: Array<{
    name: string;
    date: Date;
    earned: number;
  }>;
}

export default function ReferralStats({
  referralCode,
  totalReferrals,
  totalEarned,
  recentReferrals = [],
}: ReferralStatsProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const message = `Join RTR Official Earnings and start earning today! Use my referral code ${referralCode} when you sign up: ${referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Referral Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
          <div className="flex gap-2">
            <Input
              value={referralCode}
              readOnly
              className="font-mono font-bold text-lg"
              data-testid="input-referral-code"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
              data-testid="button-copy-referral"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Referral Link</p>
          <div className="flex gap-2 mb-3">
            <Input
              value={referralLink}
              readOnly
              className="font-mono text-sm"
              data-testid="input-referral-link"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={copyLinkToClipboard}
              data-testid="button-copy-link"
            >
              {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Share via:</p>
            <Button
              size="sm"
              variant="outline"
              onClick={shareOnWhatsApp}
              className="gap-2"
              data-testid="button-share-whatsapp"
            >
              <SiWhatsapp className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={shareOnFacebook}
              className="gap-2"
              data-testid="button-share-facebook"
            >
              <SiFacebook className="w-4 h-4" />
              Facebook
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">Total Referrals</p>
            <p className="text-2xl font-bold font-mono mt-1">{totalReferrals}</p>
          </div>
          <div className="p-4 bg-success/10 rounded-md">
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-2xl font-bold font-mono mt-1 text-success">
              ₨{totalEarned.toLocaleString()}
            </p>
          </div>
        </div>

        {recentReferrals.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-3">Recent Referrals</p>
            <div className="space-y-2">
              {recentReferrals.map((referral, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <div>
                    <p className="font-medium">{referral.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {referral.date.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-success text-success-foreground">
                    +₨{referral.earned}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-primary/10 rounded-md">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">Earn 50% Commission</p>
              <p className="text-xs text-muted-foreground mt-1">
                Get 50% of your referral's first deposit when they join using your code
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
