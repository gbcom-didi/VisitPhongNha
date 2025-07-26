import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow } from 'date-fns';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { User, Calendar, Flag, MapPin, Globe, MessageCircle, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { GuestbookEntryWithRelations, BusinessWithCategory } from '@shared/schema';

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: number;
  onBusinessClick?: (businessId: number) => void;
}

const commentFormSchema = z.object({
  comment: z.string().min(3, "Comment must be at least 3 characters long"),
});

type CommentFormData = z.infer<typeof commentFormSchema>;

// Helper function to format names for privacy
const formatPrivateName = (name: string) => {
  if (!name || name.length <= 3) return name;
  const firstPart = name.substring(0, Math.ceil(name.length / 2));
  const stars = '*'.repeat(name.length - firstPart.length);
  return firstPart + stars;
};

// Helper function to render stars
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

// Comment component
interface CommentItemProps {
  comment: any;
  selectedEntry: GuestbookEntryWithRelations;
  isAuthenticated: boolean;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  setCommentingOn: (id: number | null) => void;
  commentForm: any;
  onSubmitComment: (data: CommentFormData) => void;
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
  const maxLevel = 3;
  const canReply = level < maxLevel;

  return (
    <div className={`${level > 0 ? 'ml-6 pl-4 border-l-2 border-gray-100' : ''}`}>
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-8 h-8 bg-tropical-aqua/10 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-tropical-aqua" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">{formatPrivateName(comment.authorName)}</span>
            <span className="text-xs text-gray-500">
              {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Recently'}
            </span>
          </div>
          <p className="text-gray-800 leading-relaxed">{comment.comment}</p>
          
          {canReply && isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyingTo(replyingTo === comment.id ? null : comment.id);
                setCommentingOn(selectedEntry.id);
              }}
              className="mt-2 text-xs text-tropical-aqua hover:text-tropical-aqua/80 p-0 h-auto"
            >
              Reply
            </Button>
          )}

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Form {...commentForm}>
                <form onSubmit={commentForm.handleSubmit(onSubmitComment)} className="space-y-3">
                  <FormField
                    control={commentForm.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Add a reply..."
                            className="min-h-[60px] text-sm focus:ring-tropical-aqua focus:border-tropical-aqua"
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
                      className="bg-tropical-aqua text-white hover:bg-tropical-aqua/90"
                    >
                      {createCommentMutation.isPending ? 'Replying...' : 'Reply'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
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

export function GuestbookModal({ isOpen, onClose, entryId, onBusinessClick }: GuestbookModalProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentingOn, setCommentingOn] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // Fetch single guestbook entry
  const { data: selectedEntry, isLoading } = useQuery<GuestbookEntryWithRelations>({
    queryKey: [`/api/guestbook/${entryId}`],
    enabled: !!entryId && isOpen,
  });

  // Comment form
  const commentForm = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comment: "",
    },
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (data: CommentFormData) => {
      if (!selectedEntry) return;
      
      return apiRequest('POST', '/api/guestbook/comments', {
        entryId: selectedEntry.id,
        comment: data.comment,
        parentCommentId: replyingTo || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/guestbook/${entryId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/guestbook'] });
      commentForm.reset();
      setCommentingOn(null);
      setReplyingTo(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitComment = (data: CommentFormData) => {
    createCommentMutation.mutate(data);
  };

  const handleBusinessClick = (businessId: number) => {
    if (onBusinessClick) {
      onBusinessClick(businessId);
      onClose(); // Close guestbook modal when opening business modal
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tropical-aqua mx-auto mb-4"></div>
              <p className="text-gray-500">Loading experience...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!selectedEntry) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Experience not found.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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

          {/* Entry Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <MessageCircle className="w-4 h-4 mr-1" />
                {selectedEntry.commentCount || 0}
              </div>
            </div>

            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommentingOn(commentingOn === selectedEntry.id ? null : selectedEntry.id)}
                className="text-mango-yellow border-mango-yellow hover:bg-mango-yellow hover:text-black"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Add Comment
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: 'Sign in required',
                    description: 'Please sign in to add comments and share your travel experiences.',
                  });
                }}
                className="text-mango-yellow border-mango-yellow hover:bg-mango-yellow hover:text-black"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Add Comment
              </Button>
            )}
          </div>

          {/* Comment Form */}
          {commentingOn === selectedEntry.id && isAuthenticated && (
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
          )}

          {/* Comments */}
          {selectedEntry.comments && selectedEntry.comments.length > 0 && (
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}