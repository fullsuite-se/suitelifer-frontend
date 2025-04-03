import React from "react";

const SpotifyEmbed = ({ id, embedType, index }) => {
  return embedType === "EPISODE" ? (
    <iframe
      src={`https://open.spotify.com/embed/episode/${id}?utm_source=generator`}
      width="100%"
      color=""
      height={index === 0 ? "352" : "152"}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      key={index}
    ></iframe>
  ) : (
    <iframe
      style="border-radius:12px"
      src={`https://open.spotify.com/embed/playlist/${id}?utm_source=generator`}
      width="100%"
      height="352"
      frameBorder="0"
      allowfullscreen=""
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  );
};

export default SpotifyEmbed;
