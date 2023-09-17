import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CameraComponent from '../components/CameraComponent';
import ReviewUpload from '../components/ReviewUpload';

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
        setRecordedBlob(recordedBlob);
        setIsRecording(false); // Stop recording, hide camera, and show recordedBlob
      };

      recorder.start();
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
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
    }
  };

  return (
    <div className="page review">
      <h1>Review Page</h1>
      {isRecording ? (
        <div>
          <div>
            <CameraComponent ref={videoRef} autoPlay muted />
          </div>
          <button onClick={stopRecording}>Stop Recording</button>
        </div>
      ) : (
        <div>
          {recordedBlob ? (
            <div>
              <h2>Recorded Blob</h2>
              <video controls src={URL.createObjectURL(recordedBlob)} />
              <ReviewUpload postId={postId} recordedBlob={recordedBlob} />
            </div>
          ) : (
            <button onClick={startRecording}>Start Recording</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Review;
