import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Search, Check, X, Clock, Shield, MessageSquare, Flag, Eye, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GuestbookEntryWithRelations, BusinessWithCategory } from "@shared/schema";

const guestbookFormSchema = z.object({
  authorName: z.string().min(1, "Author name is required"),
  message: z.string().min(1, "Message is required"),
  nationality: z.string().optional(),
  location: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  relatedPlaceId: z.string().optional(),
  rating: z.string().optional(),
});

type GuestbookFormData = z.infer<typeof guestbookFormSchema>;

export default function AdminGuestbook() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<GuestbookEntryWithRelations | null>(null);
  const [moderationAction, setModerationAction] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingEntries = [] } = useQuery<GuestbookEntryWithRelations[]>({
    queryKey: ["/api/admin/guestbook/pending"],
  });

  const { data: approvedEntries = [] } = useQuery<GuestbookEntryWithRelations[]>({
    queryKey: ["/api/admin/guestbook/approved"],
  });

  const { data: spamEntries = [] } = useQuery<GuestbookEntryWithRelations[]>({
    queryKey: ["/api/admin/guestbook/spam"],
  });

  const { data: businesses = [] } = useQuery<BusinessWithCategory[]>({
    queryKey: ["/api/businesses"],
  });

  const form = useForm<GuestbookFormData>({
    resolver: zodResolver(guestbookFormSchema),
    defaultValues: {
      authorName: "",
      message: "",
      nationality: "",
      location: "",
      latitude: "",
      longitude: "",
      relatedPlaceId: "",
      rating: "",
    },
  });

  const createEntryMutation = useMutation({
    mutationFn: async (data: GuestbookFormData) => {
      const payload = {
        ...data,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        relatedPlaceId: data.relatedPlaceId ? parseInt(data.relatedPlaceId) : undefined,
        rating: data.rating ? parseInt(data.rating) : undefined,
        status: 'approved', // Admin-created entries are auto-approved
      };
      
      return apiRequest("POST", "/api/admin/guestbook", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guestbook"] });
      form.reset();
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Guestbook entry created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create entry",
        variant: "destructive",
      });
    },
  });

  const moderateEntryMutation = useMutation({
    mutationFn: async ({ entryId, status, notes }: { entryId: number; status: string; notes?: string }) => {
      return apiRequest("POST", `/api/admin/guestbook/${entryId}/moderate`, { status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guestbook"] });
      setSelectedEntry(null);
      setModerationAction("");
      toast({
        title: "Success",
        description: "Entry moderated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to moderate entry",
        variant: "destructive",
      });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (entryId: number) => {
      return apiRequest("DELETE", `/api/admin/guestbook/${entryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guestbook"] });
      toast({
        title: "Success",
        description: "Entry deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete entry",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GuestbookFormData) => {
    createEntryMutation.mutate(data);
  };

  const handleModerate = (entry: GuestbookEntryWithRelations, action: string) => {
    setSelectedEntry(entry);
    setModerationAction(action);
  };

  const confirmModeration = () => {
    if (selectedEntry && moderationAction) {
      moderateEntryMutation.mutate({
        entryId: selectedEntry.id,
        status: moderationAction,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guestbook Management</h1>
          <p className="text-gray-600">View, approve, and moderate guestbook entries</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-tropical-aqua hover:bg-tropical-aqua/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Guestbook Entry</DialogTitle>
            </DialogHeader>
            <GuestbookForm 
              form={form} 
              onSubmit={onSubmit} 
              isSubmitting={createEntryMutation.isPending}
              businesses={businesses}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pendingEntries.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Approved ({approvedEntries.length})
          </TabsTrigger>
          <TabsTrigger value="spam" className="flex items-center gap-2">
            <Flag className="w-4 h-4" />
            Spam ({spamEntries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Pending Approval
              </CardTitle>
              <CardDescription>
                Entries waiting for moderation approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GuestbookEntryList 
                entries={pendingEntries}
                onModerate={handleModerate}
                onDelete={(id) => deleteEntryMutation.mutate(id)}
                showModerationActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Approved Entries
              </CardTitle>
              <CardDescription>
                Live entries visible to the public
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GuestbookEntryList 
                entries={approvedEntries}
                onModerate={handleModerate}
                onDelete={(id) => deleteEntryMutation.mutate(id)}
                showModerationActions={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spam">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-500" />
                Spam Entries
              </CardTitle>
              <CardDescription>
                Entries marked as spam or automatically filtered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GuestbookEntryList 
                entries={spamEntries}
                onModerate={handleModerate}
                onDelete={(id) => deleteEntryMutation.mutate(id)}
                showModerationActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Moderation Confirmation Dialog */}
      <AlertDialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {moderationAction === 'approved' && 'Approve Entry'}
              {moderationAction === 'rejected' && 'Reject Entry'}
              {moderationAction === 'spam' && 'Mark as Spam'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedEntry && (
                <>
                  Are you sure you want to {moderationAction} this entry from {selectedEntry.authorName}?
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    "{selectedEntry.message.substring(0, 100)}..."
                  </div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmModeration}
              className={`${
                moderationAction === 'approved' ? 'bg-green-600 hover:bg-green-700' :
                moderationAction === 'spam' ? 'bg-red-600 hover:bg-red-700' :
                'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Guestbook Entry List Component
function GuestbookEntryList({ 
  entries, 
  onModerate, 
  onDelete, 
  showModerationActions 
}: {
  entries: GuestbookEntryWithRelations[];
  onModerate: (entry: GuestbookEntryWithRelations, action: string) => void;
  onDelete: (id: number) => void;
  showModerationActions: boolean;
}) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
        <p className="text-gray-500">No guestbook entries in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{entry.authorName}</span>
                  </div>
                  {entry.nationality && (
                    <Badge variant="outline">{entry.nationality}</Badge>
                  )}
                  {entry.rating && (
                    <Badge variant="secondary">
                      {entry.rating}⭐
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'N/A'} • 
                  {entry.relatedPlace && (
                    <span className="ml-1">Related to: {entry.relatedPlace.name}</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                {showModerationActions && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onModerate(entry, 'approved')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onModerate(entry, 'spam')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Flag className="w-4 h-4 mr-1" />
                      Spam
                    </Button>
                  </>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this guestbook entry? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => onDelete(entry.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <p className="text-gray-700">{entry.message}</p>
              
              {entry.location && (
                <p className="text-sm text-gray-500">
                  <strong>Location:</strong> {entry.location}
                </p>
              )}

              {entry.comments && entry.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Comments ({entry.comments.length})
                  </p>
                  <div className="space-y-2">
                    {entry.comments.slice(0, 2).map((comment) => (
                      <div key={comment.id} className="text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">{comment.authorName}:</span> {comment.comment}
                      </div>
                    ))}
                    {entry.comments.length > 2 && (
                      <p className="text-xs text-gray-500">
                        +{entry.comments.length - 2} more comments
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Guestbook Form Component
function GuestbookForm({ 
  form, 
  onSubmit, 
  isSubmitting, 
  businesses 
}: { 
  form: any; 
  onSubmit: (data: GuestbookFormData) => void; 
  isSubmitting: boolean; 
  businesses: BusinessWithCategory[];
}) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="authorName">Author Name *</Label>
          <Input {...form.register("authorName")} />
          {form.formState.errors.authorName && (
            <p className="text-sm text-red-600">{form.formState.errors.authorName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="nationality">Nationality</Label>
          <Input {...form.register("nationality")} placeholder="Vietnam, USA, etc." />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea {...form.register("message")} rows={4} />
        {form.formState.errors.message && (
          <p className="text-sm text-red-600">{form.formState.errors.message.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="relatedPlaceId">Related Business</Label>
          <Select onValueChange={(value) => form.setValue("relatedPlaceId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a business" />
            </SelectTrigger>
            <SelectContent>
              {businesses.map((business) => (
                <SelectItem key={business.id} value={business.id.toString()}>
                  {business.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Select onValueChange={(value) => form.setValue("rating", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1⭐</SelectItem>
              <SelectItem value="2">2⭐</SelectItem>
              <SelectItem value="3">3⭐</SelectItem>
              <SelectItem value="4">4⭐</SelectItem>
              <SelectItem value="5">5⭐</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location Description</Label>
        <Input {...form.register("location")} placeholder="Google Maps URL or location description" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input {...form.register("latitude")} placeholder="17.123456" />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input {...form.register("longitude")} placeholder="106.123456" />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-tropical-aqua hover:bg-tropical-aqua/90"
        >
          {isSubmitting ? "Creating..." : "Create Entry"}
        </Button>
      </div>
    </form>
  );
}