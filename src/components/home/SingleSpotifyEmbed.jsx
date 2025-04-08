import React from "react";

const SingleSpotifyEmbed = ({ spotifyId, embedType, index }) => {
  return (
    <iframe
      src={`https://open.spotify.com/embed/${embedType.toLowerCase()}/${spotifyId}?utm_source=generator`}
      width="100%"
      height={index === 0 ? "352" : "152"}
      style={{ borderRadius: "12px" }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      key={index}
    ></iframe>
  );
};

export default SingleSpotifyEmbed;
