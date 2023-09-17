import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CameraComponent from '../components/CameraComponent';
import { handleReviewAndUpload } from '../components/handleReviewAndUpload';


const Review = () => {
  const { postId } = useParams();
  const [videoStream, setVideoStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(recordedBlob); // Store the recordedBlob in state

        // Call the handleReviewAndUpload function to upload to S3 and submit to Supabase
        handleReviewAndUpload(postId, recordedBlob);
      };

      recorder.start();

      // Stop recording after 30 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
        }
      }, 30000);

      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="page review">
      <h1>Review Page</h1>
      <div>
        <CameraComponent ref={videoRef} autoPlay muted />
      </div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>

      {/* Display the recorded blob if available */}
      {recordedBlob && (
        <div>
          <h2>Recorded Blob</h2>
          <video controls src={URL.createObjectURL(recordedBlob)} />
          {/* Use ReviewUpload component to upload to S3 and Supabase */}
        
        </div>
      )}
    </div>
  );
};

export default Review;
