// Node modules
import React, { useState } from "react";
import { EllipsisVertical } from "lucide-react";

// Local
import { fetchUserPlaylists, addSongToPlaylist } from "api/playlistApi";
import { addToLikedSongs } from "api/likedSongsApi";
import { useAppProvider } from "providers/AppProvider";

// Assets
import "./Music.css";

function Music({ musicId, title, artist, coverArt, onClick }) {
	const { appState } = useAppProvider();
	const userId = appState.user_id; //maybe optimize this?
	const [isOpen, setIsOpen] = useState(false);

	const handleAddToQueue = () => {
		console.log("NEED TO IMPLEMENT THE QUEUE:", musicId, title);
		// Add your logic for adding to queue here
	};

	const handleAddToPlaylist = async () => {
		try {
			const playlists = await fetchUserPlaylists(userId);
			console.log("playlists:", playlists);

			if (playlists.length === 0) {
				console.log("No playlists found for the user.");
				return;
			}

			const playlistId = playlists[0].playlist_id;
			console.log("playlistId:", playlistId);

			const songData = {
				playlist_id: playlistId,
				music_id: musicId,
			};

			const result = await addSongToPlaylist(songData);
			console.log("Song added to playlist successfully:", result);
		} catch (error) {
			console.error("Error adding song to playlist:", error);
		}
	};

	const handleAddToLikedSongs = async () => {
		await addToLikedSongs(userId, musicId);
	};

	const toggleDropdown = () => {
			setIsOpen(!isOpen);
		};

	const closeDropdown = () => {
			setIsOpen(false);
	};

	return (
		<>
			<div className="music-container">
				<div className="music-photo-container" onClick={onClick}>
					<img className="music-photo" src={coverArt} />
				</div>
				<div className="info-container">
					<div className="music-info">
						<h2 className="music-title"> {title} </h2>
						<h3 className="artist-name opacity-75"> {artist} </h3>
					</div>
				</div>
				<div className="dropdown absolute right-0 bottom-3" onClick={toggleDropdown}>
					<EllipsisVertical className="opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer" />
					{isOpen && (
					<div className="dropdown-items">
						<div className="dropdown-item" onClick={() => { closeDropdown(); handleAddToQueue(); }}>
							Add to Queue
						</div>
						<div className="dropdown-item" onClick={() => { closeDropdown(); handleAddToPlaylist(); }}>
							Add to Playlist
						</div>
						<div className="dropdown-item" onClick={() => { closeDropdown(); handleAddToLikedSongs(); }}>
							Add to Liked Songs
						</div>
					</div>
					)}
				</div>
			</div>
		</>
	);
}

export default Music;
