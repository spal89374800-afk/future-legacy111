
import React from 'react';
import { Star } from 'lucide-react';

interface StarDisplayProps {
  rating: number;
  totalReviews?: number;
  size?: number;
  showText?: boolean;
}

export const StarDisplay: React.FC<StarDisplayProps> = ({ 
  rating, 
  totalReviews, 
  size = 14, 
  showText = true 
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const isFull = i < fullStars;
          const isHalf = !isFull && i === fullStars && hasHalfStar;
          
          return (
            <Star 
              key={i} 
              size={size} 
              className={`${
                isFull || isHalf ? 'text-amber-400 fill-amber-400' : 'text-slate-800'
              } ${isHalf ? 'opacity-70' : ''}`}
            />
          );
        })}
      </div>
      {showText && (
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {rating.toFixed(1)} {totalReviews !== undefined && `(${totalReviews})`}
        </span>
      )}
    </div>
  );
};

export default StarDisplay;
