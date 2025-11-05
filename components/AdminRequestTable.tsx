import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, Eye } from 'lucide-react';

interface Request {
  id: number;
  userId: number;
  userName: string;
  type: 'deposit' | 'withdrawal' | 'coin_purchase';
  amount: number;
  method: string;
  details: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface AdminRequestTableProps {
  requests: Request[];
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onView?: (id: number) => void;
}

export default function AdminRequestTable({
  requests,
  onApprove,
  onReject,
  onView,
}: AdminRequestTableProps) {
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Pending Requests
          {pendingRequests.length > 0 && (
            <Badge className="ml-2 bg-warning text-warning-foreground">
              {pendingRequests.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending requests</p>
            ) : (
              pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border rounded-md space-y-3"
                  data-testid={`request-${request.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{request.userName}</h4>
                        <Badge variant="outline">
                          {request.type === 'deposit' ? 'Deposit' : 
                           request.type === 'withdrawal' ? 'Withdrawal' : 
                           'Coin Purchase'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.date.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold font-mono">
                        {request.type === 'coin_purchase' ? 
                          `${request.amount.toLocaleString()} coins` : 
                          `₨${request.amount.toLocaleString()}`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Method:</span>
                      <span className="ml-2 font-medium">{request.method}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="ml-2 font-medium">#{request.userId}</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Details:</span>
                    <p className="mt-1 text-foreground">{request.details}</p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => onView?.(request.id)}
                      data-testid={`button-view-${request.id}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                      onClick={() => onApprove?.(request.id)}
                      data-testid={`button-approve-${request.id}`}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => onReject?.(request.id)}
                      data-testid={`button-reject-${request.id}`}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
