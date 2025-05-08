import { useEffect, useState } from "react";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed";
import {
  ExclamationTriangleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { useStore } from "../../store/authStore";
import ButtonsSpotify from "../buttons/ButtonsSpotify";
import formatTimestamp from "../../utils/formatTimestamp";
import ConfirmationDialog from "./ConfirmationDialog";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ContentButtons from "./ContentButtons";
import { useAddAuditLog } from "../../components/admin/UseAddAuditLog";

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
  const addLog = useAddAuditLog();
  const user = useStore((state) => state.user);
  const [dataUpdated, setDataUpdated] = useState(false);
  const defaultEpisodeDetails = { episodeId: null, spotifyId: "" };
  const [episodes, setEpisodes] = useState([]);
  const [episodeDetails, setEpisodeDetails] = useState(defaultEpisodeDetails);
  const [embedTypeFilter, setEmbedTypeFilter] = useState("All");
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [episodeToDelete, setEpisodeToDelete] = useState(null);
  const showError = (message) => setError(message);
  const closeError = () => setError(null);

  const openAddModal = () => {
    setEpisodeDetails(defaultEpisodeDetails);
    setOpenModal(true);
  };

  const openEditModal = (episode) => {
    setEpisodeDetails({
      episodeId: episode.episodeId,
      spotifyId: `https://open.spotify.com/${episode.embedType}/${episode.spotifyId}`,
    });
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleAddEditEpisode = async (e) => {
    e.preventDefault();

    if (!isValidEpisodeUrl(episodeDetails.spotifyId)) {
      showError(
        "The provided Spotify episode URL is invalid. Please verify the link and submit again."
      );
      closeModal();
      return;
    }

    if (episodeDetails.episodeId !== null) {
      const index = episodes.findIndex(
        (ep) => ep.episodeId === episodeDetails.episodeId
      );
      if (
        episodeDetails.spotifyId ===
        `https://open.spotify.com/episode/${episodes[index].spotifyId}`
      ) {
        closeModal();
        return;
      }
    }

    if (
      episodes.some(
        (ep) => ep.spotifyId === extractSpotifyId(episodeDetails.spotifyId)
      )
    ) {
      showError("Episode already added!");
      closeModal();
      return;
    }

    try {
      if (episodeDetails.episodeId === null) {
        const response = await api.post("/api/spotify/", {
          url: episodeDetails.spotifyId,
          userId: user.id,
        });
        //Log
        addLog({
          action: "CREATE",
          description: "A new spotify link has been added",
        });
        toast.success(response.data.message);
      } else {
        const response = await api.put(
          `/api/spotify/${episodeDetails.episodeId}`,
          {
            episodeId: episodeDetails.episodeId,
            url: episodeDetails.spotifyId,
            userId: user.id,
          }
        );
        //Log
        addLog({
          action: "UPDATE",
          description: `A spotify link has been updated`,
        });
        toast.success(response.data.message);
      }

      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.log(err);
    } finally {
      closeModal();
    }
  };

  const handleDeleteClick = (episodeId) => {
    setEpisodeToDelete(episodeId);
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (episodeToDelete !== null) {
      handleDelete(episodeToDelete);
    }
    setConfirmationOpen(false);
    setEpisodeToDelete(null);
  };

  const handleCloseDialog = () => {
    setConfirmationOpen(false);
    setEpisodeToDelete(null);
  };

  const handleDelete = async (episodeId) => {
    try {
      const response = await api.delete(`/api/spotify/${episodeId}`, {
        data: {
          episodeId,
          userId: user.id,
        },
      });
      //Log
      addLog({
        action: "DELETE",
        description: `A spotify link has been deleted`,
      });
      toast.success(response.data.message);
      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.log("unable to delete spotify link", err);
    }
  };

  const fetchSpotifyEpisodes = async () => {
    try {
      const response = await api.get("/api/spotify/");
      setEpisodes(response.data.data);
    } catch (err) {
      console.log("Unable to fetch Spotify Episodes", err);
    }
  };

  useEffect(() => {
    fetchSpotifyEpisodes();
  }, [dataUpdated]);

  const filteredEpisodes = episodes.filter((ep) => {
    if (embedTypeFilter === "All") return true;
    if (embedTypeFilter === "Episodes") return ep.embedType === "EPISODE";
    if (embedTypeFilter === "Playlists") return ep.embedType === "PLAYLIST";
    return true;
  });

  return (
    <div className="w-full space-y-4 bg mb-20">
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-4 h-full w-full">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full ">
            <div className="flex flex-col items-center justify-center gap-2 text-lg font-semibold p-3 rounded-2xl ">
              <span className="text-2xl">Invalid Spotify Link</span>
              <ExclamationTriangleIcon className="size-12 text-red-700" />
            </div>
            <p className="text-gray-700 mt-4 text-center text-sm ">{error}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={closeError}
                className="btn-light text-white px-4 py-2 rounded-4xl"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end px-4">
        <>
          <ContentButtons
            icon={<PlusCircleIcon className="size-5" />}
            text={
              embedTypeFilter === "Episodes"
                ? "Add Episode"
                : embedTypeFilter === "Playlists"
                ? "Add Playlist"
                : "Add Episode/Playlist"
            }
            handleClick={openAddModal}
          />
        </>
      </div>

      <Dialog open={openModal} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>
          {embedTypeFilter === "Episodes"
            ? episodeDetails.episodeId
              ? "Edit Spotify Episode"
              : "Add Spotify Episode"
            : embedTypeFilter === "Playlists"
            ? episodeDetails.episodeId
              ? "Edit Spotify Playlist"
              : "Add Spotify Playlist"
            : episodeDetails.episodeId
            ? "Edit Spotify Link"
            : "Add Spotify Link"}
        </DialogTitle>
        <DialogContent>
          <div className="text-md p-1 font-avenir-black">
            Spotify Link<span className="text-primary">*</span>
          </div>
          <input
            type="text"
            name="kickstartVideo"
            value={episodeDetails.spotifyId}
            onChange={(e) =>
              setEpisodeDetails((ed) => ({
                ...ed,
                spotifyId: e.target.value,
              }))
            }
            className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </DialogContent>
        <DialogActions>
          <button onClick={closeModal} className="btn-light">
            Cancel
          </button>
          <button onClick={handleAddEditEpisode} className="btn-primary">
            {episodeDetails.episodeId ? "Update" : "Add"}
          </button>
        </DialogActions>
      </Dialog>

      <ButtonsSpotify
        buttons={[
          { label: "All" },
          { label: "Episodes" },
          { label: "Playlists" },
        ]}
        onFilterChange={(filter) => setEmbedTypeFilter(filter)}
      />
      {filteredEpisodes.length < 1 ? (
        <div className="text-center py-8">
          <p className="text-lg text-primary font-semibold">
            No{" "}
            {embedTypeFilter.toLowerCase().toString() === "all"
              ? "episode/playlist"
              : embedTypeFilter.toLowerCase().toString()}{" "}
            available
          </p>
          <p className="text-sm text-gray-500">
            You haven’t added any podcast{" "}
            {embedTypeFilter.toLowerCase().toString() === "all"
              ? "episode/playlist"
              : embedTypeFilter.toLowerCase().toString()}{" "}
            yet. Once you do, they’ll show up here automatically.
          </p>
        </div>
      ) : null}

      {filteredEpisodes.map((episode, index) => (
        <div key={index} className="flex flex-col gap-4 shadow-2xs p-4">
          <div className="flex-1">
            <SingleSpotifyEmbed
              spotifyId={episode.spotifyId}
              embedType={episode.embedType}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="whitespace-nowrap flex-1/3 text-gray-500">
              <p>
                Created by:{" "}
                <span className="font-avenir-black text-primary">
                  {episode.createdBy ?? "N/A"}
                </span>
              </p>
              <p>
                Date created:{" "}
                <span className="font-avenir-black text-primary">
                  {formatTimestamp(episode.createdAt ?? "N/A").fullDate}
                </span>
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => openEditModal(episode)}
                className="cursor-pointer p-2.5 px-5 bg-primary text-white rounded-md hover:bg-[#007a8e]"
              >
                <EditIcon className="size-7" /> Edit
              </button>
              <button
                onClick={() => handleDeleteClick(episode.episodeId)}
                className="cursor-pointer p-2.5 px-4 bg-primary text-white rounded-md hover:bg-[#007a8e]"
              >
                <DeleteIcon className="size-7" /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      <ConfirmationDialog
        open={confirmationOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Spotify Episode?"
        description="Are you sure you want to delete this Spotify Link? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        icon={<ExclamationTriangleIcon className="h-12 w-12 text-red-700" />}
        cancelBtnClass="p-2 px-4 cursor-pointer rounded-lg hover:bg-gray-200 duration-500 text-gray-700"
        confirmBtnClass="p-2 px-4 cursor-pointer rounded-lg bg-red-700 hover:bg-red-800 duration-800 text-white"
      />
    </div>
  );
};

export default SpotifyEpisodes;
