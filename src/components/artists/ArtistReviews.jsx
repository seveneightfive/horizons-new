import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Star, Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ReviewForm from './ReviewForm';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const ArtistReviews = ({ reviews, artistId, onReviewAdded }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleWriteReviewClick = () => {
        if (!user) {
            toast({
                title: 'Login Required',
                description: 'You need to be logged in to write a review.',
                variant: 'destructive',
                action: <Button onClick={() => navigate('/login')}>Login</Button>
            });
            return;
        }
        setIsFormOpen(true);
    };

    return (
        <>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Card className="bg-white shadow-lg border-slate-100 flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="text-3xl uppercase tracking-wide">Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        {reviews && reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map((review, index) => (
                                    <div key={review.id}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                                            ))}
                                        </div>
                                        <blockquote className="text-slate-600 italic border-l-4 border-slate-200 pl-4">
                                            "{review.review}"
                                        </blockquote>
                                        <p className="text-right text-sm text-slate-500 mt-2 font-semibold">- {review.author || 'Anonymous'}</p>
                                        {index < reviews.length - 1 && <Separator className="my-6" />}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500">No reviews yet. Be the first to write one!</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleWriteReviewClick} className="w-full">
                            <Edit className="w-4 h-4 mr-2" />
                            Write a Review
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
            <ReviewForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} artistId={artistId} onReviewAdded={onReviewAdded} />
        </>
    );
};

export default ArtistReviews;