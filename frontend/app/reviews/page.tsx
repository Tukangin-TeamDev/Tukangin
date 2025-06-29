'use client';
import ReviewsList from '@/components/reviews/ReviewsList';

export default function ReviewsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Review</h1>
      <ReviewsList />
    </div>
  );
}
