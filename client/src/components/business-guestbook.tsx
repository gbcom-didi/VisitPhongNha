import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Star, User, MapPin, CalendarDays, Send, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { BusinessWithCategory, GuestbookEntryWithRelations } from '@shared/schema';

interface BusinessGuestbookProps {
  business: BusinessWithCategory;
}

const guestbookFormSchema = z.object({
  message: z.string().min(10, "Please share at least 10 characters about your experience"),
  nationality: z.string().optional(),
  rating: z.string().min(1, "Please rate your experience"),
});

type GuestbookFormData = z.infer<typeof guestbookFormSchema>;

export function BusinessGuestbook({ business }: BusinessGuestbookProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const form = useForm<GuestbookFormData>({
    resolver: zodResolver(guestbookFormSchema),
    defaultValues: {
      message: "",
      nationality: "",
      rating: "",
    },
  });

  // Fetch guestbook entries for this business (limit to 3 most recent)
  const { data: allGuestbookEntries = [], isLoading } = useQuery<GuestbookEntryWithRelations[]>({
    queryKey: [`/api/businesses/${business.id}/guestbook`],
  });

  // Limit to 3 most recent entries
  const guestbookEntries = allGuestbookEntries.slice(0, 3);

  // Create guestbook entry mutation
  const createEntryMutation = useMutation({
    mutationFn: async (data: GuestbookFormData) => {
      return apiRequest('POST', '/api/guestbook', {
        ...data,
        relatedPlaceId: business.id,
        rating: parseInt(data.rating, 10),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/businesses/${business.id}/guestbook`] });
      queryClient.invalidateQueries({ queryKey: ['/api/guestbook'] });
      form.reset();
      setShowForm(false);
      toast({
        title: "Thank you!",
        description: "Your experience has been shared and will appear after review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to share your experience. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GuestbookFormData) => {
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

  const formatUserName = (firstName: string | null, lastName: string | null) => {
    if (!firstName) return 'Anonymous';
    if (!lastName) return firstName;
    return `${firstName} ${lastName.charAt(0)}.`;
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-tropical-aqua" />
          <h3 className="text-lg font-semibold">Guest Experiences</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          Loading experiences...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-tropical-aqua" />
          <h3 className="text-lg font-semibold">Guest Experiences</h3>
        </div>
        
        {isAuthenticated && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-coral-sunset hover:bg-coral-sunset/90 text-white"
            size="sm"
          >
            <Send className="w-4 h-4 mr-2" />
            Share Experience
          </Button>
        )}
      </div>

      {/* Add Experience Form */}
      {showForm && isAuthenticated && (
        <Card className="border-tropical-aqua/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-tropical-aqua" />
              Share Your Experience
            </CardTitle>
            <CardDescription>
              Tell other travelers about your experience at {business.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Experience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your experience at this place..."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
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

                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Australian, Vietnamese"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={createEntryMutation.isPending}
                    className="bg-tropical-aqua hover:bg-tropical-aqua/90"
                  >
                    {createEntryMutation.isPending ? "Sharing..." : "Share Experience"}
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
          </CardContent>
        </Card>
      )}

      {/* Sign in prompt for non-authenticated users */}
      {!isAuthenticated && (
        <Card className="border-mango-yellow/20 bg-mango-yellow/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-mango-yellow mx-auto mb-2" />
              <p className="text-gray-600 mb-3">
                Sign in to share your experience at {business.name}
              </p>
              <Button 
                variant="outline" 
                className="border-mango-yellow text-mango-yellow hover:bg-mango-yellow hover:text-white"
                onClick={() => {
                  // This will trigger the auth modal
                  window.dispatchEvent(new CustomEvent('openAuthModal'));
                }}
              >
                Sign In to Share
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Experiences */}
      {guestbookEntries.length > 0 ? (
        <div className="space-y-4">
          <Separator />
          <h4 className="font-medium text-gray-900">Recent Experiences</h4>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {guestbookEntries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Header with rating and author */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-tropical-aqua/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-tropical-aqua" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {entry.authorName || 'Anonymous'}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {entry.nationality && (
                              <>
                                <span>{entry.nationality}</span>
                                <span>•</span>
                              </>
                            )}
                            <div className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {formatDate(entry.createdAt)}
                            </div>
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
                    <p className="text-gray-700 leading-relaxed">{entry.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View Guestbook Link - Always show */}
          <div className="text-center pt-4">
            <Link href="/guestbook">
              <Button 
                variant="outline" 
                className="text-tropical-aqua border-tropical-aqua hover:bg-tropical-aqua hover:text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Guestbook
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No experiences shared yet</p>
          <p className="text-sm text-gray-400">
            Be the first to share your experience at {business.name}
          </p>
        </div>
      )}
    </div>
  );
}