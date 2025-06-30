import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Shield, MessageSquare, AlertTriangle, CheckCircle, XCircle, Edit3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PendingEntry {
  id: number;
  authorName: string;
  message: string;
  nationality?: string;
  location?: string;
  spamScore?: number;
  createdAt: string;
  rating?: number;
}

export function ModerationPage() {
  const { currentUser, canAccessAdmin } = useAuth();
  const { toast } = useToast();
  const [moderationNotes, setModerationNotes] = useState<{ [key: number]: string }>({});
  const [editingEntry, setEditingEntry] = useState<PendingEntry | null>(null);
  const [editForm, setEditForm] = useState({
    message: '',
    nationality: '',
    location: '',
    relatedPlaceId: '',
    rating: ''
  });

  // Redirect non-admin users
  if (!canAccessAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600">You need admin privileges to access this page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Fetch pending entries
  const { data: pendingEntries = [], isLoading: pendingLoading } = useQuery<PendingEntry[]>({
    queryKey: ['/api/admin/guestbook/pending'],
    enabled: canAccessAdmin(),
  });

  // Fetch spam entries
  const { data: spamEntries = [], isLoading: spamLoading } = useQuery<PendingEntry[]>({
    queryKey: ['/api/admin/guestbook/spam'],
    enabled: canAccessAdmin(),
  });

  // Fetch businesses for the edit dialog
  const { data: businesses = [] } = useQuery<any[]>({
    queryKey: ['/api/businesses'],
  });

  // Edit entry mutation
  const editMutation = useMutation({
    mutationFn: async ({ entryId, updates }: { entryId: number; updates: any }) => {
      return apiRequest('PUT', `/api/admin/guestbook/${entryId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/guestbook/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/guestbook/spam'] });
      queryClient.invalidateQueries({ queryKey: ['/api/guestbook'] });
      setEditingEntry(null);
      toast({ title: "Entry updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update entry", variant: "destructive" });
    },
  });

  // Moderation mutation
  const moderateMutation = useMutation({
    mutationFn: async ({ entryId, status, notes }: { entryId: number; status: string; notes?: string }) => {
      return apiRequest('POST', `/api/admin/guestbook/${entryId}/moderate`, { status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/guestbook/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/guestbook/spam'] });
      queryClient.invalidateQueries({ queryKey: ['/api/guestbook'] });
      toast({ title: "Entry moderated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to moderate entry", variant: "destructive" });
    },
  });

  const handleModerate = (entryId: number, status: string) => {
    const notes = moderationNotes[entryId] || '';
    moderateMutation.mutate({ entryId, status, notes });
    setModerationNotes(prev => ({ ...prev, [entryId]: '' }));
  };

  const handleEditEntry = (entry: PendingEntry) => {
    setEditingEntry(entry);
    setEditForm({
      message: entry.message || '',
      nationality: entry.nationality || '',
      location: entry.location || '',
      relatedPlaceId: entry.relatedPlaceId?.toString() || '',
      rating: entry.rating?.toString() || ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingEntry) return;
    
    const updates = {
      message: editForm.message,
      nationality: editForm.nationality || null,
      location: editForm.location || null,
      relatedPlaceId: editForm.relatedPlaceId ? parseInt(editForm.relatedPlaceId) : null,
      rating: editForm.rating ? parseInt(editForm.rating) : null
    };

    editMutation.mutate({ entryId: editingEntry.id, updates });
  };

  const EntryCard = ({ entry, showSpamScore = false }: { entry: PendingEntry; showSpamScore?: boolean }) => (
    <Card key={entry.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{entry.authorName}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>{formatDistanceToNow(new Date(entry.createdAt))} ago</span>
              {entry.nationality && <span>• {entry.nationality}</span>}
              {entry.rating && (
                <div className="flex items-center">
                  <span>• {entry.rating}/5 ⭐</span>
                </div>
              )}
            </div>
          </div>
          {showSpamScore && entry.spamScore && (
            <Badge variant={entry.spamScore > 70 ? "destructive" : entry.spamScore > 40 ? "secondary" : "outline"}>
              Spam Score: {entry.spamScore}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{entry.message}</p>
        
        {entry.location && (
          <p className="text-sm text-gray-500 mb-4">📍 {entry.location}</p>
        )}

        <Textarea
          placeholder="Moderation notes (optional)"
          value={moderationNotes[entry.id] || ''}
          onChange={(e) => setModerationNotes(prev => ({ ...prev, [entry.id]: e.target.value }))}
          className="mb-3"
        />

        <div className="flex gap-2">
          <Button
            onClick={() => handleModerate(entry.id, 'approved')}
            disabled={moderateMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            onClick={() => handleModerate(entry.id, 'rejected')}
            disabled={moderateMutation.isPending}
            variant="outline"
            size="sm"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </Button>
          <Button
            onClick={() => handleModerate(entry.id, 'spam')}
            disabled={moderateMutation.isPending}
            variant="destructive"
            size="sm"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Mark as Spam
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
          <p className="text-gray-600">Review and moderate guestbook entries and comments</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Pending ({pendingEntries.length})
            </TabsTrigger>
            <TabsTrigger value="spam" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Spam Detected ({spamEntries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingLoading ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-gray-500">Loading pending entries...</p>
                  </CardContent>
                </Card>
              ) : pendingEntries.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-500">No pending entries to review!</p>
                  </CardContent>
                </Card>
              ) : (
                pendingEntries.map((entry: PendingEntry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="spam">
            <div className="space-y-4">
              {spamLoading ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-gray-500">Loading spam entries...</p>
                  </CardContent>
                </Card>
              ) : spamEntries.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-500">No spam detected!</p>
                  </CardContent>
                </Card>
              ) : (
                spamEntries.map((entry: PendingEntry) => (
                  <EntryCard key={entry.id} entry={entry} showSpamScore />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}