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
import { MessageCircle, Star, MapPin, Globe, Calendar, Flag, User, Reply } from 'lucide-react';
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

// Form schema for comments
const commentSchema = z.object({
  comment: z.string().min(1, 'Comment is required').max(500, 'Comment must be less than 500 characters'),
});

type CommentForm = z.infer<typeof commentSchema>;

interface CommentItemProps {
  comment: any;
  selectedEntry: any;
  isAuthenticated: boolean;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  setCommentingOn: (id: number | null) => void;
  commentForm: any;
  onSubmitComment: (data: CommentForm) => void;
  createCommentMutation: any;
  level: number;
}

function CommentItem({ 
  comment, 
  selectedEntry, 
  isAuthenticated, 
  replyingTo, 
  setReplyingTo, 
  setCommentingOn, 
  commentForm, 
  onSubmitComment, 
  createCommentMutation, 
  level 
}: CommentItemProps) {
  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-mango-yellow/20 pl-4' : ''}`}>
      <div className="bg-mango-yellow/5 rounded-lg p-3 border border-mango-yellow/10">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-mango-yellow rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatPrivateName(comment.authorName)}
            </span>
            <span className="text-xs text-gray-500">
              {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Recently'}
            </span>
          </div>
          

        </div>
        <p className="text-sm text-gray-700 mb-2">{comment.comment}</p>
        
        {/* Reply Button */}
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (replyingTo === comment.id) {
                setReplyingTo(null);
                setCommentingOn(null);
              } else {
                setReplyingTo(comment.id);
                setCommentingOn(selectedEntry.id);
              }
            }}
            className="text-xs text-mango-yellow hover:text-mango-yellow/80 h-6 px-2"
          >
            <Reply className="w-3 h-3 mr-1" />
            Reply
          </Button>
        )}

        {/* Reply Form */}
        {replyingTo === comment.id && isAuthenticated && (
          <div className="mt-3 pt-3 border-t border-mango-yellow/10">
            <Form {...commentForm}>
              <form onSubmit={commentForm.handleSubmit(onSubmitComment)} className="space-y-2">
                <FormField
                  control={commentForm.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={`Reply to ${comment.authorName}...`}
                          className="min-h-[60px] text-sm focus:ring-mango-yellow focus:border-mango-yellow"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={createCommentMutation.isPending}
                    className="bg-mango-yellow text-black hover:bg-mango-yellow/90 text-xs h-7"
                  >
                    {createCommentMutation.isPending ? 'Replying...' : 'Reply'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setCommentingOn(null);
                      commentForm.reset();
                    }}
                    className="text-xs h-7"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
      
      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply: any) => (
            <CommentItem 
              key={reply.id}
              comment={reply}
              selectedEntry={selectedEntry}
              isAuthenticated={isAuthenticated}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              setCommentingOn={setCommentingOn}
              commentForm={commentForm}
              onSubmitComment={onSubmitComment}
              createCommentMutation={createCommentMutation}

              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Guestbook() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [commentingOn, setCommentingOn] = useState<number | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<GuestbookEntryWithRelations | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
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

  // Create guestbook entry mutation
  const createEntryMutation = useMutation({
    mutationFn: async (data: GuestbookEntryForm) => {
      return apiRequest('POST', '/api/guestbook', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/guestbook'] });
      setShowForm(false);
      entryForm.reset();
      toast({
        title: 'Success',
        description: 'Your guestbook entry has been added!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create guestbook entry',
        variant: 'destructive',
      });
    },
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async ({ entryId, comment, parentCommentId }: { entryId: number; comment: string; parentCommentId?: number }) => {
      const payload: { comment: string; parentCommentId?: number } = { comment };
      if (parentCommentId) {
        payload.parentCommentId = parentCommentId;
      }
      return apiRequest('POST', `/api/guestbook/${entryId}/comments`, payload);
    },
    onSuccess: async (newComment, variables) => {
      // Invalidate and refetch the guestbook data to get updated comment counts and nested structure
      await queryClient.invalidateQueries({ queryKey: ['/api/guestbook'] });
      
      // If a modal is open for this entry, update the selected entry
      if (selectedEntry && selectedEntry.id === variables.entryId) {
        const updatedData = await queryClient.refetchQueries({ queryKey: ['/api/guestbook'] });
        const updatedEntry = updatedData[0]?.data?.find((entry: any) => entry.id === variables.entryId);
        if (updatedEntry) {
          setSelectedEntry(updatedEntry);
        }
      }
      
      setCommentingOn(null);
      setReplyingTo(null);
      commentForm.reset();
      toast({
        title: 'Success',
        description: 'Your comment has been added!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add comment',
        variant: 'destructive',
      });
    },
  });



  // Form setup
  const entryForm = useForm<GuestbookEntryForm>({
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

  const commentForm = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: '',
    },
  });

  const onSubmitEntry = (data: GuestbookEntryForm) => {
    // Convert string fields to proper types
    const submitData = {
      ...data,
      relatedPlaceId: data.relatedPlaceId || undefined,
      rating: data.rating || undefined,
    };
    createEntryMutation.mutate(submitData);
  };

  const onSubmitComment = (data: CommentForm) => {
    if (commentingOn) {
      // If replying to a comment, prepend the reply prefix
      const comment = replyingTo ? `@${selectedEntry?.comments?.find(c => c.id === replyingTo)?.authorName} ${data.comment}` : data.comment;
      
      createCommentMutation.mutate({
        entryId: commentingOn,
        comment: comment,
        parentCommentId: replyingTo || undefined,
      });
      commentForm.reset();
      setReplyingTo(null);
      setCommentingOn(null);
    }
  };





  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Travelers' Guestbook
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Share your experiences, memories, and recommendations from your journey in Phong Nha. 
            Connect with fellow travelers and leave your mark on our community.
          </p>
          <div className="flex justify-center items-center text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
            </div>
          </div>
        </div>

        {/* Add Entry Button */}
        {isAuthenticated && (
          <div className="mb-8 text-center">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-mango-yellow text-black hover:bg-mango-yellow/90 shadow-lg"
              size="lg"
            >
              {showForm ? 'Cancel' : 'Add Your Experience'}
            </Button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mb-8 text-center">
            <Card className="bg-mango-yellow/10 border-mango-yellow/20">
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  Sign in to share your travel experiences and connect with other travelers!
                </p>
                <Button 
                  className="bg-mango-yellow text-black hover:bg-mango-yellow/90"
                  onClick={() => setShowSignInModal(true)}
                >
                  Sign In to Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Entry Form */}
        {showForm && (
          <Card className="mb-8 border-mango-yellow/20 shadow-lg">
            <CardHeader className="bg-mango-yellow/10">
              <CardTitle className="text-gray-900">Share Your Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...entryForm}>
                <form onSubmit={entryForm.handleSubmit(onSubmitEntry)} className="space-y-6">
                  <FormField
                    control={entryForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your experience, thoughts, or recommendations about Phong Nha..."
                            className="min-h-[120px] focus:ring-mango-yellow focus:border-mango-yellow"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={entryForm.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Vietnam, Australia, United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={entryForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Google Maps URL</FormLabel>
                            <button 
                              type="button" 
                              className="text-gray-400 hover:text-gray-600"
                              title="To get a Google Maps URL: 1. Open Google Maps 2. Search for your location 3. Click the Share button 4. Copy the link that appears"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </div>
                          <FormControl>
                            <Input placeholder="https://maps.google.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={entryForm.control}
                      name="relatedPlaceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Related Place</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                            value={field.value?.toString() || ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a place (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                      control={entryForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Overall Rating</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                            value={field.value?.toString() || ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Rate your experience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="5">5 stars - Amazing!</SelectItem>
                              <SelectItem value="4">4 stars - Great</SelectItem>
                              <SelectItem value="3">3 stars - Good</SelectItem>
                              <SelectItem value="2">2 stars - Okay</SelectItem>
                              <SelectItem value="1">1 star - Poor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={createEntryMutation.isPending}
                      className="bg-mango-yellow text-black hover:bg-mango-yellow/90 shadow-lg"
                    >
                      {createEntryMutation.isPending ? 'Sharing...' : 'Share Experience'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Guestbook Entries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {entries.length === 0 ? (
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No entries yet
                  </h3>
                  <p className="text-gray-600">
                    Be the first to share your experience in Phong Nha!
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            entries.map((entry) => (
              <Card 
                key={entry.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-l-mango-yellow cursor-pointer h-fit"
                onClick={() => setSelectedEntry(entry)}
              >
                <CardContent className="p-6">
                  {/* Entry Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-mango-yellow rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{formatPrivateName(entry.authorName)}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {entry.createdAt ? formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true }) : 'Recently'}
                          </div>
                          {entry.nationality && (
                            <div className="flex items-center">
                              <Flag className="w-4 h-4 mr-1" />
                              {entry.nationality}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    {entry.rating && (
                      <div className="flex items-center space-x-1">
                        {renderStars(entry.rating)}
                      </div>
                    )}
                  </div>

                  {/* Entry Content Preview */}
                  <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed line-clamp-3">
                      {entry.message}
                    </p>
                  </div>

                  {/* Related Place */}
                  {entry.relatedPlace && (
                    <div className="mb-4">
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer transition-all duration-200 px-3 py-1.5 text-sm font-medium hover:shadow-md hover:scale-105"
                        style={{ 
                          backgroundColor: '#F4B942', 
                          color: 'white', 
                          borderColor: '#F4B942'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#E6A435';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F4B942';
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBusinessClick(entry.relatedPlace!.id);
                        }}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {entry.relatedPlace.name}
                      </Badge>
                    </div>
                  )}

                  {/* Entry Actions - Comment functionality temporarily hidden */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      {/* Comment count removed */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal for Full Entry View */}
        {selectedEntry && (
          <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-mango-yellow rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{formatPrivateName(selectedEntry.authorName)}</span>
                    {selectedEntry.rating && (
                      <div className="flex items-center space-x-1 mt-1">
                        {renderStars(selectedEntry.rating)}
                      </div>
                    )}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Travel experience from {formatPrivateName(selectedEntry.authorName)} {selectedEntry.nationality && `from ${selectedEntry.nationality}`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Entry Metadata */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {selectedEntry.createdAt ? formatDistanceToNow(new Date(selectedEntry.createdAt), { addSuffix: true }) : 'Recently'}
                  </div>
                  {selectedEntry.nationality && (
                    <div className="flex items-center">
                      <Flag className="w-4 h-4 mr-1" />
                      {selectedEntry.nationality}
                    </div>
                  )}
                </div>

                {/* Full Message */}
                <div className="text-gray-800 leading-relaxed">
                  {selectedEntry.message}
                </div>

                {/* Related Place */}
                {selectedEntry.relatedPlace && (
                  <div>
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer transition-all duration-200 px-3 py-1.5 text-sm font-medium hover:shadow-md hover:scale-105"
                      style={{ 
                        backgroundColor: '#F4B942', 
                        color: 'white', 
                        borderColor: '#F4B942'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E6A435';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F4B942';
                      }}
                      onClick={() => handleBusinessClick(selectedEntry.relatedPlace!.id)}
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {selectedEntry.relatedPlace.name}
                    </Badge>
                  </div>
                )}

                {/* Location */}
                {selectedEntry.location && (
                  <div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-1" />
                      {selectedEntry.location.startsWith('http') ? (
                        <a
                          href={selectedEntry.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-mango-yellow hover:underline font-medium"
                        >
                          View on Google Maps
                        </a>
                      ) : (
                        selectedEntry.location
                      )}
                    </div>
                  </div>
                )}

                {/* Entry Actions - Comment functionality temporarily hidden */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    {/* Comment count and add comment buttons removed */}
                  </div>
                </div>

                {/* Comment Form - Temporarily hidden */}
                {/* {commentingOn === selectedEntry.id && isAuthenticated && (
                  <div className="pt-4 border-t border-gray-100">
                    <Form {...commentForm}>
                      <form onSubmit={commentForm.handleSubmit(onSubmitComment)} className="space-y-4">
                        <FormField
                          control={commentForm.control}
                          name="comment"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Add a comment..."
                                  className="min-h-[80px] focus:ring-mango-yellow focus:border-mango-yellow"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            size="sm"
                            disabled={createCommentMutation.isPending}
                            className="bg-mango-yellow text-black hover:bg-mango-yellow/90"
                          >
                            {createCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCommentingOn(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                )} */}

                {/* Comments - Temporarily hidden */}
                {/* {selectedEntry.comments && selectedEntry.comments.length > 0 && (
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <h4 className="font-medium text-gray-900">Comments ({selectedEntry.comments.length})</h4>
                    {selectedEntry.comments.map((comment) => (
                      <CommentItem 
                        key={comment.id} 
                        comment={comment} 
                        selectedEntry={selectedEntry}
                        isAuthenticated={isAuthenticated}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                        setCommentingOn={setCommentingOn}
                        commentForm={commentForm}
                        onSubmitComment={onSubmitComment}
                        createCommentMutation={createCommentMutation}

                        level={0}
                      />
                    ))}
                  </div>
                )} */}
              </div>
            </DialogContent>
          </Dialog>
        )}

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
    </div>
  );
}