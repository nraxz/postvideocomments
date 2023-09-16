import supabase from "../config/supabaseClient";
import { useEffect, useState } from 'react';

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [stories, setStories] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select();

      if (error) {
        setFetchError('Could not fetch the stories');
        setStories(null);
        console.log(error);
      }
      if (data) {
        setStories(data);
        setFetchError(null);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="page home">
      {fetchError && <p>{fetchError}</p>}
      {stories && (
        <div className="row">
          {stories.map((story) => (
            <div className="col-md-4 mb-3" key={story.id}>
              <div className="card">
                {/* Image */}
                <img
                  src={story.image} // Assuming story.image contains the image URL
                  className="card-img-top"
                  alt={story.title}
                />
                <div className="card-body">
                  {/* Title */}
                  <h5 className="card-title">{story.title}</h5>
                  {/* Detail */}
                  <p className="card-text">{story.details}</p>
                </div>
                <div className="card-footer">
                <a href="#" class="btn btn-primary">तपाइँलाइ के लाग्छ?</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default Home;
