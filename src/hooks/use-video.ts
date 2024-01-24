import { useReducer } from "react";

type VideoTypeAction = {
  type:
    | "change-mute"
    | "play"
    | "pause"
    | "change-play"
    | "buffering"
    | "clear-buffer"
    | "error"
    | "clear-error";
};

type VideoPayloadAction = {
  type: "change-progress";
  playload: number;
};

const initialVideoState = {
  isMuted: false,
  hasError: false,
  isPlaying: false,
  isBuffering: false,
  currentProgress: 0,
};

type VideoAction = VideoTypeAction | VideoPayloadAction;

function videoReducer(state: typeof initialVideoState, action: VideoAction) {
  switch (action.type) {
    case "change-mute":
      return { ...state, isMuted: !state.isMuted };
    case "play":
      return { ...state, isPlaying: true };
    case "pause":
      return { ...state, isPlaying: false };
    case "change-play":
      return { ...state, isPlaying: !state.isPlaying };
    case "buffering":
      return { ...state, isBuffering: true };
    case "clear-buffer":
      return { ...state, isBuffering: false };
    case "error":
      return { ...state, hasError: true };
    case "clear-error":
      return { ...state, hasError: false };
    case "change-progress":
      return { ...state, currentProgress: action.playload };
    default:
      return state;
  }
}

const useVideo = () => {
  return useReducer(videoReducer, initialVideoState);
};

export default useVideo;
