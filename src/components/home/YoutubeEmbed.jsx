const YouTubeEmbed = ({ embedUrl }) => {
    return (
        <iframe
        className="w-full aspect-video rounded-2xl"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
    );  
  };

export default YouTubeEmbed;
  