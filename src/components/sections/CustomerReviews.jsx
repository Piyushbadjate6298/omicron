import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react';
import { reviews } from '../../data/reviews';
import './CustomerReviews.css';

const ReviewCard = ({ review, onReadMore }) => {
  const isLong = review.text.length > 150;
  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-avatar">{review.name.charAt(0)}</div>
        <div className="review-meta">
          <h4>{review.name}</h4>
          <div className="review-stars">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>
        </div>
      </div>
      <div className="review-body">
        <p className="review-text">
          "{isLong ? review.text.substring(0, 150) + '...' : review.text}"
        </p>
        {isLong && (
          <button className="read-more-btn" onClick={() => onReadMore(review)}>
            Read More
          </button>
        )}
      </div>
      <div className="google-icon-wrapper">
         <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="google-icon" />
      </div>
    </div>
  );
};

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(reviews.length); // Start at middle clone
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [modalReview, setModalReview] = useState(null);
  const [showAll, setShowAll] = useState(false);
  
  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Triple the reviews array for infinite scroll
  const extendedReviews = [...reviews, ...reviews, ...reviews];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 760) setVisibleCards(1);
      else if (window.innerWidth < 1000) setVisibleCards(2);
      else setVisibleCards(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  }, [isTransitioning]);

  const prev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  }, [isTransitioning]);

  // Handle transition end for infinite looping
  useEffect(() => {
    if (!isTransitioning) return;
    
    const transitionEnd = setTimeout(() => {
      setIsTransitioning(false);
      
      // If we reach the end of the first set (going left)
      if (currentIndex === 0) {
        setCurrentIndex(reviews.length);
      }
      // If we reach the start of the third set (going right)
      else if (currentIndex === reviews.length * 2) {
        setCurrentIndex(reviews.length);
      }
    }, 500); // matches CSS transition time
    
    return () => clearTimeout(transitionEnd);
  }, [currentIndex, isTransitioning]);

  // Autoplay
  useEffect(() => {
    if (isPaused || showAll || modalReview) return;
    const interval = setInterval(next, 2000);
    return () => clearInterval(interval);
  }, [next, isPaused, showAll, modalReview]);

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };
  
  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      next();
    } else if (touchStartX.current - touchEndX.current < -50) {
      prev();
    }
    setIsPaused(false);
  };

  // Keyboard accessibility for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalReview(null);
        setShowAll(false);
      }
    };
    if (modalReview || showAll) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [modalReview, showAll]);

  return (
    <section className="customer-reviews-section">
      <div className="container">
        <div className="reviews-header">
          <div>
            <div className="eyebrow">FROM OUR TRAVELLERS</div>
            <h2 className="section-title">What Our Travellers Say</h2>
            <p className="section-copy">Real experiences shared by our valued travellers.</p>
          </div>
          <button className="view-all-btn" onClick={() => setShowAll(true)} aria-label="View all reviews">
            View All Reviews <ArrowRight size={18} />
          </button>
        </div>

        <div 
          className="reviews-slider-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="reviews-slider"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
            }}
          >
            {extendedReviews.map((review, idx) => (
              <div 
                className="review-slide" 
                key={`${review.id}-${idx}`}
                style={{ width: `${100 / visibleCards}%` }}
              >
                <ReviewCard 
                  review={review} 
                  onReadMore={(r) => {
                    setIsPaused(true);
                    setModalReview(r);
                  }} 
                />
              </div>
            ))}
          </div>

          <button 
            className="slider-arrow slider-prev" 
            onClick={prev}
            aria-label="Previous review"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className="slider-arrow slider-next" 
            onClick={next}
            aria-label="Next review"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Read More Modal */}
      {modalReview && (
        <div className="review-modal-overlay" onClick={() => setModalReview(null)}>
          <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setModalReview(null)}>
              <X size={24} />
            </button>
            <div className="review-card-header modal-header">
              <div className="review-avatar">{modalReview.name.charAt(0)}</div>
              <div className="review-meta">
                <h4>{modalReview.name}</h4>
                <div className="review-stars">
                  {[...Array(modalReview.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            <p className="full-review-text">"{modalReview.text}"</p>
          </div>
        </div>
      )}

      {/* All Reviews Drawer / Modal */}
      {showAll && (
        <div className="all-reviews-overlay" onClick={() => setShowAll(false)}>
          <div className="all-reviews-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="all-reviews-header">
              <h2>All Customer Reviews</h2>
              <button className="close-drawer-btn" onClick={() => setShowAll(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="all-reviews-list">
              {reviews.map(review => (
                <div className="all-review-card" key={review.id}>
                  <div className="review-card-header">
                    <div className="review-avatar">{review.name.charAt(0)}</div>
                    <div className="review-meta">
                      <h4>{review.name}</h4>
                      <div className="review-stars">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="full-review-text">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
