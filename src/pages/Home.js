import supabase from "../config/supabaseClient";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [stories, setStories] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data: storiesData, error: storiesError } = await supabase
          .from('stories')
          .select()
          .eq('status', 'Active');

        if (storiesError) {
          throw storiesError;
        }

        // Fetch review counts for each story
        const storiesWithReviewCounts = await Promise.all(
          storiesData.map(async (story) => {
            const { data: reviewsData, error: reviewsError } = await supabase
              .from('reviews')
              .select('id')
              .eq('post_id', story.id);

            if (reviewsError) {
              throw reviewsError;
            }

            story.reviewCount = reviewsData.length;
            return story;
          })
        );

        setStories(storiesWithReviewCounts);
        setFetchError(null);
      } catch (error) {
        setFetchError('Could not fetch the stories');
        setStories(null);
        console.error(error);
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
                  <Link to={`/review/${story.id}`} className="btn btn-primary">तपाइँलाइ के लाग्छ?</Link>
                  <Link to={`/detail/${story.id}`} className="btn btn-secondary ml-2">
                    {story.reviewCount > 0 ? `${story.reviewCount} Reviews` : 'View'}
                  </Link>
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
