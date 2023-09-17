import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const ReviewUpload = ({ postId, recordedBlob }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);

    try {
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // Replace with your Supabase project URL
      const supabaseApiKey = process.env.REACT_APP_SUPABASE_KEY; // Replace with your Supabase project API Key
      const supabase = createClient(supabaseUrl, supabaseApiKey);

      // Generate a unique name for the recordedBlob (e.g., a timestamp)
      const reviewVideoName = Date.now().toString() + '.webm';

      // Upload the recordedBlob to Supabase Storage
      const { data: storageResponse, error: storageError } = await supabase.storage
        .from('videoreviews') // Replace with your actual storage bucket name
        .upload(reviewVideoName, recordedBlob);

      if (storageError) {
        console.error('Error uploading to Supabase Storage:', storageError);
        return;
      }

      //const fileUrl = storageResponse.Key;
      
      const fileUrl  = supabase
      .storage
      .from('videoreviews')
      .getPublicUrl( reviewVideoName)

      // Save data to the 'reviews' table
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .insert([
          {
            post_id: postId,
            videoname: reviewVideoName,
            file_url: fileUrl, // Store the file URL in the table
          },
        ]);

      if (reviewsError) {
        console.error('Error submitting data to Supabase:', reviewsError);
      } else {
        console.log('Data submitted to Supabase:', reviewsData);
       
      }
    } catch (error) {
      console.error('Error handling review and upload:', error);

      // Handle specific errors as needed
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <button onClick={handleUpload} disabled={isUploading}>
        Upload
      </button>
    </div>
  );
};

export default ReviewUpload;
