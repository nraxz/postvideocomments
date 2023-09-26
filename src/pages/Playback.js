import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../config/supabaseClient';

const Playback = () => {
  const { videoName } = useParams();
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    // Construct the full URL to the video using Supabase storage
    const fullVideoUrl = `https://mnsajxsioozbftmjdazk.supabase.co/storage/v1/object/public/videoreviews/${videoName}`;

    setVideoUrl(fullVideoUrl);
  }, [videoName]);

  return (
    <div className="page video-playback">
      <h1>Video Playback</h1>
      <div>
        <video controls>
          <source src={videoUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Playback;
