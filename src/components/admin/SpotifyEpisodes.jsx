import { useState } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed"

const SpotifyEpisodes = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-primary border-2 rounded-3xl w-full overflow-hidden">
      <Card sx={{ boxShadow: "none", padding: 0 }}>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-gray-100 rounded flex items-center p-4 cursor-pointer"
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Spotify Episodes
          </Typography>
          <IconButton>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
        {isExpanded && (
          <CardContent className="p-4">
            <SingleSpotifyEmbed />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default SpotifyEpisodes;
