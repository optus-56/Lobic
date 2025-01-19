// Node modules
import { useEffect } from "react";
import ReactDOM from "react-dom";

// Local
import { MPState, fetchMusicUrl } from "api/musicApi";
import { AppContextType, useAppProvider } from "providers/AppProvider";
import { LobbyContextType, useLobbyProvider } from "providers/LobbyProvider";
import { MusicContextType, useMusicProvider } from "providers/MusicProvider";
import { SocketContextType, useSocketProvider } from "providers/SocketProvider";

const AudioElement = () => {
	const { appState, updateAppState } = useAppProvider();
	const { lobbyState } = useLobbyProvider();
	const {
		audioRef,
		musicState,
		updateMusicState,
		getAudioElement,
		setControlsDisabled
	} = useMusicProvider();

	// If page is refreshed initializing the audio
	useEffect(() => {
		// Initializing the audio if the music exists in state
		const init_audio = async () => {
			if (musicState.id === null) return;

			const audioElement = getAudioElement();
			if (audioElement === null) return;

			updateMusicState({
				state: MPState.PAUSE,
				timestamp: 0,
			});

			audioElement.src = await fetchMusicUrl(musicState.id);
			await audioElement.pause();
		};
		init_audio();
	}, []);

	// Handling controls access
	useEffect(() => {
		if (musicState.id === null) {
			setControlsDisabled(true);
		}
		else if (lobbyState.in_lobby && lobbyState.is_host) {
			setControlsDisabled(false);
		}
		else if (lobbyState.in_lobby && !lobbyState.is_host) {
			setControlsDisabled(true);
		}
		else if (!lobbyState.in_lobby) {
			setControlsDisabled(false);
		}
	}, [lobbyState, musicState]);

	// Music State Handler
	useEffect(() => {
		const audioElement = getAudioElement();

		if (audioElement === null) {
			console.log("AudioElement is missing");
			return;
		}

		if (musicState.id === null) {
			audioElement.src = "";
			audioElement.currentTime = 0;
		}

		const musicStateManager = async () => {
			if (musicState.state === MPState.PLAY) {
				if (audioElement.paused)
					await audioElement.play();
			}
			else if (musicState.state === MPState.PAUSE) {
				if (!audioElement.paused)
					await audioElement.pause();
			}
			else if (musicState.state === MPState.CHANGE_MUSIC) {
				try {
					audioElement.src = await fetchMusicUrl(musicState.id);
					audioElement.volume = musicState.volume / 100;
					audioElement.currentTime = 0;
					updateMusicState({ timestamp: 0 });
				} catch(err) {
					console.error("Failed to play music:", err);
				} finally {
					updateMusicState({ state: MPState.PLAY });
				}
			}
			else if (musicState.state === MPState.CHANGE_TIME) {
				audioElement.currentTime = musicState.state_data;
				if (audioElement.paused) {
					updateMusicState({ state: MPState.PAUSE, state_data: 0 });
				} else {
					updateMusicState({ state: MPState.PLAY, state_data: 0 });
				}
			}
			else if (musicState.state === MPState.CHANGE_VOLUME) {
				audioElement.volume = musicState.state_data / 100;
				if (audioElement.paused) {
					updateMusicState({ state: MPState.PAUSE, state_data: 0 });
				} else {
					updateMusicState({ state: MPState.PLAY, state_data: 0 });
				}
			}
		}

		musicStateManager();
	}, [musicState]);

	// Event listeners for audio element
	useEffect(() => {
		const audioElement = getAudioElement();
		if (!audioElement) return;
	
		const timeUpdateHandler = () => {
			updateMusicState({ timestamp: audioElement.currentTime });
		};
	
		const loadedMetadataHandler = () => {
			updateMusicState({ duration: audioElement.duration });
		};
	
		const volumeChangeHandler = () => {
			updateMusicState({ volume: audioElement.volume * 100 });
		};
	
		audioElement.addEventListener("timeupdate", timeUpdateHandler);
		audioElement.addEventListener("loadedmetadata", loadedMetadataHandler);
		audioElement.addEventListener("volumechange", volumeChangeHandler);
	
		// Cleanup event listeners on component unmount
		return () => {
			audioElement.removeEventListener("timeupdate", timeUpdateHandler);
			audioElement.removeEventListener("loadedmetadata", loadedMetadataHandler);
			audioElement.removeEventListener("volumechange", volumeChangeHandler);
		};
	}, []);

	const handleOnEnded = () => {
		updateMusicState({ state: MPState.PAUSE });
	};

	return ReactDOM.createPortal(
		<audio ref={audioRef} onEnded={handleOnEnded} />,
		document.body,
	);
};

export default AudioElement;
