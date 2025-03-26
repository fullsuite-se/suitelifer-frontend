import { useEffect, useState } from "react";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed";
import {
  TrashIcon,
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

const extractSpotifyId = (url) => {
  return url.split("episode/")[1].split("?")[0];
};

const isValidEpisodeUrl = (url) => {
  try {
    const parsedUrl = new URL(url);

    if (!parsedUrl.hostname.endsWith("spotify.com")) return false;

    const episodeRegex = /^\/episode\/[a-zA-Z0-9]{22}$/;

    return episodeRegex.test(parsedUrl.pathname);
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
    episode_id: null,
    id: "",
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

    if (!isValidEpisodeUrl(episodeDetails.id)) {
      setEpisodeDetails(defaultEpisodeDetails);
      return showError("Invalid Spotify episode URL.");
    }

    if (
      episodes.some(
        (ep) => ep.spotifyId === extractSpotifyId(episodeDetails.id)
      )
    ) {
      setEpisodeDetails(defaultEpisodeDetails);
      return showError("Episode already added!");
    }

    try {
      if (episodeDetails.episode_id === null) {
        // ADD SPOTIFY EPISODE
        const response = await api.post("/api/add-episode", {
          url: episodeDetails.id,
          user_id: user.id,
        });

        toast.success(response.data.message);

        setDataUpdated(!dataUpdated);
      } else {
        const index = episodes.findIndex(
          (episode) => episode.episodeId === episodeDetails.episode_id
        );

        if (
          episodeDetails.id ===
          `https://open.spotify.com/episode/${episodes[index].spotifyId}`
        ) {
          setEpisodeDetails(defaultEpisodeDetails);
          return;
        }

        const response = await api.post("/api/edit-episode", {
          episode_id: episodeDetails.episode_id,
          url: episodeDetails.id,
          user_id: user.id,
        });

        toast.success(response.data.message);

        setDataUpdated(!dataUpdated);
      }
    } catch (err) {
      console.log(err);
    }

    setEpisodes((e) => [...e, episodeDetails]);
    setEpisodeDetails(defaultEpisodeDetails);
  };

  const cancelEdit = () => {
    setEpisodeDetails(defaultEpisodeDetails);
  };

  const deleteEpisode = (id) => {
    setEpisodes(episodes.filter((ep) => ep.episode_id !== id));
  };

  const handleDeleteClick = (episode_id) => {
    showConfirmationToast({
      message: "Delete spotify episode?",
      onConfirm: () => handleDelete(episode_id),
      onCancel: null,
    });
  };

  const handleDelete = async (episode_id) => {
    try {
      const response = await api.post("/api/delete-episode", {
        episode_id,
        user_id: user.id,
      });

      toast.success(response.data.message);

      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSpotifyEpisodes = async () => {
    try {
      const response = await api.get("/api/all-episodes");

      console.log(response.data.data);

      setEpisodes(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSpotifyEpisodes();
  }, [dataUpdated]);

  return (
    <div className="border-primary border-2 rounded-2xl w-full p-4 space-y-4">
      {error && (
        <div className="fixed inset-0 flex items-center justify-center ">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full border-2 border-red-500/95 ">
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

      <div className="flex gap-2">
        <input
          type="text"
          value={episodeDetails.id}
          onChange={(e) =>
            setEpisodeDetails((ed) => ({ ...ed, id: e.target.value }))
          }
          placeholder="Enter Spotify episode URL"
          className="border p-2 rounded-2xl w-full"
        />
        {episodeDetails.episode_id !== null ? (
          <>
            <button
              onClick={(e) => handleAddEditEpisode(e)}
              className="btn-primary p-2"
            >
              Save
            </button>
            <button onClick={cancelEdit} className="btn-light p-2">
              <XCircleIcon className="size-6" />
            </button>
          </>
        ) : (
          <button
            onClick={(e) => handleAddEditEpisode(e)}
            className="btn-light"
          >
            <PlusIcon className="size-7" />
          </button>
        )}
      </div>

      {/* Episodes List */}
      {episodes.length === 0 ? (
        <div className="p-4 text-center text-gray-600">
          No episodes added yet.
        </div>
      ) : (
        episodes.map((episode) => {
          return (
            <div
              key={episode.episodeId}
              className="border rounded-2xl p-2 flex gap-2"
            >
              <div className="w-[96%]">
                <SingleSpotifyEmbed spotifyId={episode.spotifyId} />
              </div>
              <div className="w-[4%] sm:min-w-[5%] flex flex-col mx-auto justify-evenly items-center gap-2">
                <button
                  onClick={() => {
                    setEpisodeDetails({
                      episode_id: episode.episodeId,
                      id: `https://open.spotify.com/episode/${episode.spotifyId}`,
                    });
                  }}
                  className="bg-primary text-white w-full rounded-2xl cursor-pointer transition-all duration-500 hover:bg-[#007a8e] h-[50%]"
                >
                  <EditIcon className="size-7" />
                </button>
                <button
                  onClick={() => handleDeleteClick(episode.episodeId)}
                  className="bg-primary text-white w-full rounded-2xl cursor-pointer transition-all duration-500 hover:bg-[#007a8e] h-[50%]"
                >
                  <DeleteIcon className="size-7" />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SpotifyEpisodes;
