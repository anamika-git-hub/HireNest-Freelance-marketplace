import React, { useState,useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosConfig from '../../service/axios';

interface FreelancerReviewModalProps {
  freelancerId: string;
  taskId: string;
  contractId: string;
  projectName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const FreelancerReviewModal: React.FC<FreelancerReviewModalProps> = ({
  freelancerId,
  taskId,
  contractId,
  projectName,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [existingReview, setExistingReview] = useState<any>(null);
  

  useEffect(() => {
    const checkExistingReview = async () => {
      try {
        const response = await axiosConfig.get(`/client/freelancer-reviews/${freelancerId}`);
        const reviews = response.data.reviews;
        const existing = reviews.find((r: any) => r.contractId === contractId);
        
        if (existing) {
          setExistingReview(existing);
          setRating(existing.rating);
          setReview(existing.review);
        }
      } catch (err) {
        console.error('Error checking existing review:', err);
      }
    };
    
    checkExistingReview();
  }, [freelancerId, contractId]);


  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await axiosConfig.post('/client/review-freelancer', {
        freelancerId,
        contractId,
        taskId,
        rating,
        review
      });
      
      toast.success(existingReview?'Review updated successfully':'Review submitted successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to submit review');
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{existingReview ? 'Update Your Review' : 'Rate Your Experience'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-1">Project: {projectName}</p>
          <p className="text-gray-600 mb-2">How would you rate your experience with this freelancer?</p>
          
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className="cursor-pointer text-2xl"
                color={(hover || rating) >= star ? "#FFD700" : "#e4e5e9"}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
          
          <label htmlFor="review" className="block mb-2 text-sm font-medium text-gray-700">
            Share your experience (optional)
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Tell us about your experience working with this freelancer..."
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            {existingReview ? 'Cancel' : 'Skip'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerReviewModal;