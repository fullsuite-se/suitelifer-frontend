import { useState } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed";

const SpotifyEpisodes = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-primary border-2 rounded-3xl w-full overflow-hidden">
      <SingleSpotifyEmbed />
    </div>
  );
};

export default SpotifyEpisodes;
