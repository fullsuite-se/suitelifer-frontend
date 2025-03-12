import React from "react";

const SpotifyEmbed = ({id, index}) => {
  return (
    <iframe
      src={`https://open.spotify.com/embed/episode/${id}?utm_source=generator`}
      width="100%"
      color=""
      height={index === 0 ? "352" : "152"}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      key={index}
    ></iframe>
  );
};

export default SpotifyEmbed;
