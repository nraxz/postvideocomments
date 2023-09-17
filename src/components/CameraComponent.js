import React, { useEffect, useRef, useState } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const [isCameraLoading, setIsCameraLoading] = useState(true);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Get access to the user's camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Set the camera stream as the source of the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraLoading(false); // Camera is loaded
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setIsCameraLoading(false); // Camera access failed
      }
    };

    // Start the camera when the component mounts
    startCamera();

    // Clean up by stopping the camera when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="camera-container">
      <h2>Camera</h2>
      {isCameraLoading ? (
        <video ref={videoRef} autoPlay muted playsInline />
      ) : (
        <video ref={videoRef} autoPlay muted playsInline />
      )}
    </div>
  );
};

export default CameraComponent;
