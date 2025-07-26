import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/navigation';
import { BusinessModal } from '@/components/business-modal';
import { SignInModal } from '@/components/auth/SignInModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Star, MapPin, Globe, Calendar, Flag, User, Plus, ExternalLink } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { BusinessWithCategory, GuestbookEntryWithRelations } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

// Helper function to format names with privacy (First Name + Last Initial)
const formatPrivateName = (fullName: string): string => {
  const nameParts = fullName.trim().split(' ');
  if (nameParts.length === 1) {
    return nameParts[0];
  }
  const firstName = nameParts[0];
  const lastInitial = nameParts[nameParts.length - 1][0]?.toUpperCase();
  return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
};

// Form schema for guestbook entries
const guestbookEntrySchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
  nationality: z.string().optional(),
  location: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  relatedPlaceId: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
});

type GuestbookEntryForm = z.infer<typeof guestbookEntrySchema>;

export function Guestbook() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<GuestbookEntryWithRelations | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithCategory | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Fetch guestbook entries
  const { data: entries = [], isLoading } = useQuery<GuestbookEntryWithRelations[]>({
    queryKey: ['/api/guestbook'],
  });

  // Fetch businesses for the related place dropdown
  const { data: businesses = [] } = useQuery<BusinessWithCategory[]>({
    queryKey: ['/api/businesses'],
  });

  // Helper function to handle business modal opening
  const handleBusinessClick = (businessId: number) => {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
    }
  };

  const form = useForm<GuestbookEntryForm>({
    resolver: zodResolver(guestbookEntrySchema),
    defaultValues: {
      message: '',
      nationality: '',
      location: '',
      latitude: '',
      longitude: '',
      relatedPlaceId: undefined,
      rating: undefined,
    },
  });

  // Create guestbook entry mutation
  const createEntryMutation = useMutation({
    mutationFn: async (data: GuestbookEntryForm) => {
      return apiRequest('POST', '/api/guestbook', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/guestbook'] });
      form.reset();
      setShowForm(false);
      toast({
        title: 'Thank you!',
        description: 'Your entry has been submitted and will appear after review.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit entry. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: GuestbookEntryForm) => {
    createEntryMutation.mutate(data);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Loading guestbook entries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Traveler Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your experiences and read stories from fellow travelers exploring Phong Nha
          </p>
        </div>

        {/* Add Entry Button */}
        <div className="text-center mb-8">
          {isAuthenticated ? (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-tropical-aqua hover:bg-tropical-aqua/90 text-white px-8 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Share Your Story
            </Button>
          ) : (
            <Button 
              onClick={() => setShowSignInModal(true)}
              variant="outline"
              className="border-tropical-aqua text-tropical-aqua hover:bg-tropical-aqua hover:text-white px-8 py-3"
            >
              Sign In to Share Your Story
            </Button>
          )}
        </div>

        {/* Guestbook Entries */}
        <div className="max-w-4xl mx-auto">
          {entries.length > 0 ? (
            <div className="space-y-6">
              {entries.map((entry) => (
                <Card key={entry.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header with author and rating */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-tropical-aqua/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-tropical-aqua" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {entry.authorName || 'Anonymous'}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {entry.nationality && (
                                <>
                                  <Globe className="w-3 h-3" />
                                  <span>{entry.nationality}</span>
                                  <span>•</span>
                                </>
                              )}
                              <Calendar className="w-3 h-3" />
                              <span>
                                {entry.createdAt ? formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true }) : 'Recently'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {entry.rating && (
                          <div className="flex items-center gap-1">
                            {renderStars(entry.rating)}
                          </div>
                        )}
                      </div>

                      {/* Message */}
                      <p className="text-gray-700 leading-relaxed text-lg">{entry.message}</p>

                      {/* Location and Related Place */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {entry.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{entry.location}</span>
                          </div>
                        )}
                        
                        {entry.relatedPlace && (
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant="outline" 
                              className="text-tropical-aqua border-tropical-aqua cursor-pointer hover:bg-tropical-aqua hover:text-white"
                              onClick={() => handleBusinessClick(entry.relatedPlace!.id)}
                            >
                              {entry.relatedPlace.name}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No stories yet</h3>
              <p className="text-gray-500 mb-6">
                Be the first to share your travel experience in Phong Nha!
              </p>
              {isAuthenticated ? (
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-tropical-aqua hover:bg-tropical-aqua/90"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Share Your Story
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowSignInModal(true)}
                  variant="outline"
                  className="border-tropical-aqua text-tropical-aqua hover:bg-tropical-aqua hover:text-white"
                >
                  Sign In to Share
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Entry Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Your Travel Story</DialogTitle>
            <DialogDescription>
              Tell fellow travelers about your experience in Phong Nha
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Experience *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your experience, tips, or memorable moments from your visit..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Australian" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Rate your experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                          <SelectItem value="2">⭐⭐ Fair</SelectItem>
                          <SelectItem value="1">⭐ Poor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="relatedPlaceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Place (Optional)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a place you visited" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-48">
                        {businesses.map((business) => (
                          <SelectItem key={business.id} value={business.id.toString()}>
                            {business.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Details (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Phong Nha town, or Google Maps URL" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={createEntryMutation.isPending}
                  className="bg-tropical-aqua hover:bg-tropical-aqua/90"
                >
                  {createEntryMutation.isPending ? 'Sharing...' : 'Share Story'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Business Modal */}
      {selectedBusiness && (
        <BusinessModal
          business={selectedBusiness}
          isOpen={!!selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}

      {/* Sign In Modal */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
    </div>
  );
}