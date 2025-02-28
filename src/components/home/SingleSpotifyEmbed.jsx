const SingleSpotifyEmbed = ({ spotifyId }) => {
  
    return (
      <iframe
      className=""
        src={`https://open.spotify.com/embed/episode/${spotifyId}?utm_source=generator`}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    );
  };  

  export default SingleSpotifyEmbed;