import React, { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { addReview } from '@/lib/api';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ReviewForm = ({ isOpen, onOpenChange, artistId, onReviewAdded }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const resetForm = () => {
        setRating(0);
        setHoverRating(0);
        setReviewText('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Not Logged In',
                description: 'You must be logged in to submit a review.',
            });
            return;
        }

        setIsLoading(true);
        try {
            const reviewData = {
                artist_id: artistId,
                rating,
                review: reviewText,
                author: user.user_metadata?.full_name || user.email.split('@')[0],
                user_id: user.id
            };
            
            const newReviewArray = await addReview(reviewData);

            if (newReviewArray && newReviewArray.length > 0) {
                 toast({
                    title: 'Review Submitted!',
                    description: 'Thanks for your feedback.',
                });
                onReviewAdded(newReviewArray[0]);
                resetForm();
                onOpenChange(false);
            } else {
                 throw new Error("Failed to submit review. Please try again.");
            }
           
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>Share your experience with the community.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Your Rating</Label>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <Star
                                        key={starValue}
                                        className={cn(
                                            "w-8 h-8 cursor-pointer transition-colors",
                                            starValue <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'
                                        )}
                                        onClick={() => setRating(starValue)}
                                        onMouseEnter={() => setHoverRating(starValue)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="review">Your Review</Label>
                         <Textarea
                            id="review"
                            placeholder="Tell us what you thought..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={5}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading || rating === 0 || !reviewText}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Review
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewForm;