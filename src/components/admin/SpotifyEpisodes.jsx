import { useState } from "react";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed";
import {
  PlusIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const extractSpotifyId = (url) => {
  const match = url.match(/episode\/([^?]+)/);
  return match ? match[1] : null;
};

const SpotifyEpisodes = () => {
  const [episodes, setEpisodes] = useState([
    {
      id: 1,
      url: "https://open.spotify.com/episode/1P8NLsRXlIcTiG6mobhC4m?si=54cbb1bb38fb4365",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState(null);

  const showError = (message) => setError(message);
  const closeError = () => setError(null);

  const addEpisode = () => {
    const spotifyId = extractSpotifyId(newUrl);
    if (!spotifyId) return showError("Invalid Spotify episode URL.");
    if (episodes.some((ep) => ep.url === newUrl))
      return showError("Episode already added!");

    setEpisodes([...episodes, { id: Date.now(), url: newUrl }]);
    setNewUrl("");
  };

  const editEpisode = (id) => {
    const episode = episodes.find((ep) => ep.id === id);
    if (episode) {
      setNewUrl(episode.url);
      setEditingId(id);
    }
  };

  const saveEdit = () => {
    const spotifyId = extractSpotifyId(newUrl);
    if (!spotifyId) return showError("Invalid Spotify episode URL.");

    setEpisodes(
      episodes.map((ep) => (ep.id === editingId ? { ...ep, url: newUrl } : ep))
    );
    setEditingId(null);
    setNewUrl("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewUrl("");
  };

  const deleteEpisode = (id) => {
    setEpisodes(episodes.filter((ep) => ep.id !== id));
  };

  return (
    <div className="border-primary border-2 rounded-2xl w-full p-4 space-y-4">
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

      <div className="flex gap-2">
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Enter Spotify episode URL"
          className="border p-2 rounded-2xl w-full"
        />
        {editingId ? (
          <>
            <button onClick={saveEdit} className="btn-primary p-2">
              Save
            </button>
            <button onClick={cancelEdit} className="btn-light p-2">
              <XCircleIcon className="size-6" />
            </button>
          </>
        ) : (
          <button onClick={addEpisode} className="btn-light">
            <PlusIcon className="size-5" />
          </button>
        )}
      </div>

      {episodes.length === 0 ? (
        <div className="p-4 text-center text-gray-600">
          No episodes added yet.
        </div>
      ) : (
        episodes.map((episode) => {
          const spotifyId = extractSpotifyId(episode.url);
          return (
            <div key={episode.id} className="flex flex-col sm:flex-row gap-2">
              <div className="w-full sm:w-[96%]">
                <SingleSpotifyEmbed spotifyId={spotifyId} />
              </div>
              <div className="w-full sm:w-[4%] sm:min-w-[5%] flex flex-row sm:flex-col mx-auto justify-evenly items-center gap-2">
                <button
                  onClick={() => editEpisode(episode.id)}
                  className="bg-primary text-white w-[48%] sm:w-full rounded-2xl cursor-pointer transition-all duration-500 hover:bg-[#007a8e] h-[50%]"
                >
                  <EditIcon className="size-7" />
                </button>
                <button
                  onClick={() => deleteEpisode(episode.id)}
                  className="bg-primary text-white w-[48%] sm:w-full rounded-2xl cursor-pointer transition-all duration-500 hover:bg-[#007a8e] h-[50%]"
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
