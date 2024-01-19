import { useReducer } from "react";

type VideoTypeAction = {
  type:
    | "mute"
    | "change-mute"
    | "play"
    | "pause"
    | "change-play"
    | "buffer"
    | "clear-buffer"
    | "error"
    | "clear-error";
};

type VideoPayloadAction = {
  type: "change-hold-time" | "change-progress";
  playload: number;
};

const initialVideoState = {
  isMuted: false,
  hasError: false,
  isPlaying: false,
  isBuffering: false,
  holdTime: 0,
  currentProgress: 0,
};

type VideoAction = VideoTypeAction | VideoPayloadAction;

function videoReducer(state: typeof initialVideoState, action: VideoAction) {
  switch (action.type) {
    case "mute":
      return { ...state, isMuted: true };
    case "change-mute":
      return { ...state, isMuted: !state.isMuted };
    case "play":
      return { ...state, isPlaying: true };
    case "pause":
      return { ...state, isPlaying: false };
    case "change-play":
      return { ...state, isPlaying: !state.isPlaying };
    case "buffer":
      return { ...state, isBuffering: true };
    case "clear-buffer":
      return { ...state, isBuffering: false };
    case "error":
      return { ...state, hasError: true };
    case "clear-error":
      return { ...state, hasError: false };
    case "change-hold-time":
      return { ...state, holdTime: action.playload };
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
