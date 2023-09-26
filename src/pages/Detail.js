import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../config/supabaseClient';

const Detail = () => {
  const { postId } = useParams();
  const [story, setStory] = useState(null);
  const [reviews, setReviews] = useState([]);
  const publicUrl = 'https://mnsajxsioozbftmjdazk.supabase.co/storage/v1/object/public/videoreviews/';
  useEffect(() => {
    const fetchStory = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select()
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching story:', error);
        setStory(null);
      } else {
        setStory(data);
      }
    };

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select()
        .eq('post_id', postId);

      if (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } else {
        setReviews(data);
      }
    };

    fetchStory();
    fetchReviews();
  }, [postId]);

  return (
    <div className="container mt-4">
      {story && (
        <div>
          <h1 className="mb-4">{story.title}</h1>
          <img src={story.image} alt={story.title} className="img-fluid rounded" />
          <p className="mt-4">{story.details}</p>
        </div>
      )}

{reviews.length > 0 && (
  <div className="mt-4">
    <h2>Reviews</h2>
    <ul>
      {reviews.map((review) => (
        <li key={review.id}>
          <p>
            Video Name:{' '}
            
              <a href={publicUrl + review.videoname } target="_blank" rel="noopener noreferrer">
                {review.videoname}
              </a>
            
          </p>
          {/* Add more review details as needed */}
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
};

export default Detail;
