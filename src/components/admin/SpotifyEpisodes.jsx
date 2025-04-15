import { useEffect, useState } from "react";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed";
import {
  PlusIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { useStore } from "../../store/authStore";
import { showConfirmationToast } from "../toasts/confirm";
import ButtonsSpotify from "./ButtonsSpotify";

const extractSpotifyId = (url) => {
  const match = url.match(/(?:episode|playlist)\/([^?]+)/);
  return match ? match[1] : null;
};

const isValidEpisodeUrl = (url) => {
  try {
    const parsedUrl = new URL(url);

    if (!parsedUrl.hostname.endsWith("spotify.com")) return false;

    const embedRegex = /^\/(episode|playlist)\/[a-zA-Z0-9]{22}$/;

    return embedRegex.test(parsedUrl.pathname);
  } catch (error) {
    return false;
  }
};

const SpotifyEpisodes = () => {
  // USER DETAILS
  const user = useStore((state) => state.user);

  // DATA UPDATES
  const [dataUpdated, setDataUpdated] = useState(false);

  // SPOTIFY VARIABLES
  const defaultEpisodeDetails = {
    episodeId: null,
    spotifyId: "",
  };

  const [episodes, setEpisodes] = useState([]);
  const [episodeDetails, setEpisodeDetails] = useState(defaultEpisodeDetails);

  const [error, setError] = useState(null);

  const showError = (message) => {
    setError(message);
  };

  const closeError = () => {
    setError(null);
  };

  const handleAddEditEpisode = async (e) => {
    e.preventDefault();

    if (!isValidEpisodeUrl(episodeDetails.spotifyId)) {
      setEpisodeDetails(defaultEpisodeDetails);
      return showError("Invalid Spotify episode URL.");
    }

    if (episodeDetails.episodeId !== null) {
      const index = episodes.findIndex(
        (episode) => episode.episodeId === episodeDetails.episodeId
      );
      if (
        episodeDetails.spotifyId ===
        `https://open.spotify.com/episode/${episodes[index].spotifyId}`
      ) {
        setEpisodeDetails(defaultEpisodeDetails);
        return;
      }
    }

    if (
      episodes.some(
        (ep) => ep.spotifyId === extractSpotifyId(episodeDetails.spotifyId)
      )
    ) {
      setEpisodeDetails(defaultEpisodeDetails);
      return showError("Episode already added!");
    }

    try {
      if (episodeDetails.episodeId === null) {
        // ADD SPOTIFY EPISODE
        const response = await api.post("/api/spotify/", {
          url: episodeDetails.spotifyId,
          userId: user.id,
        });

        toast.success(response.data.message);

        setDataUpdated(!dataUpdated);
      } else {
        // EDIT SPOTIFY EPISODE
        const response = await api.put(
          `/api/spotify/${episodeDetails.episodeId}`,
          {
            episodeId: episodeDetails.episodeId,
            url: episodeDetails.spotifyId,
            userId: user.id,
          }
        );

        toast.success(response.data.message);

        setDataUpdated(!dataUpdated);
      }
    } catch (err) {
      console.log(err);
    }

    setEpisodeDetails(defaultEpisodeDetails);
  };

  const cancelEdit = () => {
    setEpisodeDetails(defaultEpisodeDetails);
  };

  const handleDeleteClick = (episodeId) => {
    showConfirmationToast({
      message: "Delete spotify episode?",
      onConfirm: () => handleDelete(episodeId),
      onCancel: null,
    });
  };

  const handleDelete = async (episodeId) => {
    try {
      const response = await api.delete(
        `/api/spotify/${episodeDetails.episodeId}`,
        {
          episodeId,
          userId: user.id,
        }
      );

      toast.success(response.data.message);

      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSpotifyEpisodes = async () => {
    try {
      const response = await api.get("/api/spotify/");

      console.log(response.data.data);

      console.log(response.data);

      setEpisodes(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSpotifyEpisodes();
  }, [dataUpdated]);

  return (
    <div className="w-full space-y-4 bg mb-20">
      {error && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full border-2 border-red-500/95">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold p-3 rounded-2xl">
              <ExclamationTriangleIcon className="size-12 text-red-500" />
              <span className="text-red-500 text-2xl">Error</span>
            </div>
            <p className="text-gray-800 mt-4 text-center text-xl">{error}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={closeError}
                className="btn-light text-white px-4 py-2 rounded-4xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-y-auto space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={episodeDetails.spotifyId}
            onChange={(e) =>
              setEpisodeDetails((ed) => ({ ...ed, spotifyId: e.target.value }))
            }
            placeholder="Enter Spotify episode URL"
            className="border p-2 px-4 rounded-2xl w-full"
          />
          {episodeDetails.episodeId !== null ? (
            <>
              <button
                onClick={(e) => handleAddEditEpisode(e)}
                className="grid place-items-center cursor-pointer hover:bg-gray-100 rounded-full size-10 text-primary"
              >
                <PlusIcon className="size-5" />
              </button>
              <button onClick={cancelEdit} className="hover:text-[#007a8e] cursor-pointer text-primary">
                <XCircleIcon className="size-8" />
              </button>
            </>
          ) : (
            <button
              onClick={(e) => handleAddEditEpisode(e)}
              className="cursor-pointer btn-light"
            >
              <PlusIcon className="size-5 sm:size-7" />
            </button>
          )}
        </div>

        <ButtonsSpotify
          buttons={[
            { label: "All" },
            { label: "Episodes" },
            { label: "Playlists" },
          ]}
        />

        {episodes.length === 0 ? (
          <div className="p-4 text-center text-gray-600">
            No episodes added yet.
          </div>
        ) : (
          episodes.map((episode, index) => {
            return (
              <div key={index} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <SingleSpotifyEmbed
                    spotifyId={episode.spotifyId}
                    embedType={episode.embedType}
                  />
                </div>
                <div className="flex flex-row sm:flex-col justify-center items-center gap-2">
                  <button
                    onClick={() => {
                      setEpisodeDetails({
                        episodeId: episode.episodeId,
                        spotifyId: `https://open.spotify.com/episode/${episode.spotifyId}`,
                      });
                    }}
                    className="p-3 sm:p-5 bg-primary text-white rounded-xl cursor-pointer transition-all duration-500 hover:bg-[#007a8e] h-full w-full"
                  >
                    <EditIcon className="size-7" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(episode.episodeId)}
                    className="p-3 sm:p-5 bg-primary text-white rounded-xl cursor-pointer transition-all duration-500 hover:bg-[#007a8e] h-full w-full"
                  >
                    <DeleteIcon className="size-7" /> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SpotifyEpisodes;
