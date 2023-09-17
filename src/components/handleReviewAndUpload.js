import supabase from '../config/supabaseClient';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Uploads a recorded blob to S3 and inserts a review record into Supabase.
 *
 * @param {string} postId The ID of the post that the review is for.
 * @param {Blob} recordedBlob The recorded blob to upload.
 */
export async function handleReviewAndUpload(postId, recordedBlob) {
  try {
    // Generate a unique name for the recordedBlob (e.g., a timestamp)
    const reviewVideoName = Date.now().toString() + '.webm';
    const client = new S3Client({ region: "us-west-2" });

    // Create an S3 instance
    const command = new PutObjectCommand({
        Bucket: "videosreviews",
        Key: reviewVideoName,
        Body: recordedBlob,
        ContentType: 'video/webm',
      });

    
      const supabaseData = {
        post_id: postId,
        videoname: reviewVideoName,
      };
      const { data, error } = await supabase.from('reviews').insert([supabaseData]);
    const s3UploadResponse = await getSignedUrl(client, command, { expiresIn: 3600 });

    // Submit data to Supabase
    

   

    if (error) {
      console.error('Error submitting data to Supabase:', error);
    } else {
      console.log('Data submitted to Supabase:', data);
    }

    // Get the URL of the uploaded file from the S3 upload response
    const uploadedFileUrl = s3UploadResponse.Location;

    console.log('File uploaded to S3:', uploadedFileUrl);
  } catch (error) {
    console.error('Error handling review and upload:', error);

    // Check for specific errors
    if (error.code === 'AccessDenied') {
      console.error('You do not have permission to upload files to this S3 bucket.');
    } else if (error.code === 'InvalidBucketName') {
      console.error('The S3 bucket name is invalid.');
    } else if (error.code === 'NoSuchBucket') {
      console.error('The S3 bucket does not exist.');
    }
  }
}
