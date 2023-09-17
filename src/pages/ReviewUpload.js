import React, { useEffect, useState } from 'react';
import AWS from '../config/awsS3';
import supabase from '../config/supabaseClient';

const ReviewUpload = ({ postId, recordedBlob }) => {
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    const uploadToS3AndSupabase = async () => {
      try {
        // Generate a unique name for the recordedBlob (e.g., a timestamp)
        const uniqueName = Date.now().toString() + '.webm';

        // Upload the recordedBlob to your S3 bucket
        const s3 = new AWS.S3();
        const params = {
          Bucket: process.env.AWS_BUCKET, // Use your S3 bucket name from environment variables
          Key: uniqueName,
          Body: recordedBlob,
        };
        const s3UploadResponse = await s3.upload(params).promise();

        // Submit data to Supabase
        const supabaseData = {
          post_id: postId,
          video_name: uniqueName,
          // Include other form data here
        };
        const { data, error } = await supabase.from('reviews').insert([supabaseData]);

        if (error) {
          setUploadStatus('Error submitting data to Supabase');
          console.error('Error submitting data to Supabase:', error);
        } else {
          setUploadStatus('Data submitted to Supabase');
          console.log('Data submitted to Supabase:', data);
        }

        console.log('File uploaded to S3:', s3UploadResponse);
      } catch (error) {
        setUploadStatus('Error handling review and upload');
        console.error('Error handling review and upload:', error);
      }
    };

    // Call the upload function when the component mounts
    uploadToS3AndSupabase();
  }, [postId, recordedBlob]);

  return (
    <div>
      <h2>Upload Status</h2>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default ReviewUpload;
