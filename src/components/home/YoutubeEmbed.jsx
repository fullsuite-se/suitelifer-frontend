const YouTubeEmbed = ({ videoId }) => {
    return (
        <iframe
        className="w-full aspect-video rounded-2xl"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
    );  
  };

export default YouTubeEmbed;
  