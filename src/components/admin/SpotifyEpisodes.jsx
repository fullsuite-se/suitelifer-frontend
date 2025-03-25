import { useState } from "react";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed";

const SpotifyEpisodes = () => {

  return (
    <div className="border-primary border-2 rounded-3xl w-full overflow-hidden p-2 flex flex-col gap-2">
      <SingleSpotifyEmbed />
      <SingleSpotifyEmbed />
      <SingleSpotifyEmbed />  
    </div>
  );
};

export default SpotifyEpisodes;
