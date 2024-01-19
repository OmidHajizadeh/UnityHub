import { useEffect } from "react";
import ReactPlayer from "react-player";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "../loaders/Spinner";
import useVideo from "@/hooks/use-video";

type UnityHubVideoPlayerRaw = {
  videoUrl: string;
  className?: string;
  isListItem?: boolean;
  isFromForm?: never;
  videoErrorHandling?: never;
};

type UnityHubVideoPlayerForm = {
  videoUrl: string;
  className?: never;
  isListItem?: never;
  isFromForm: boolean;
  videoErrorHandling: any;
};

type UnityHubVideoPlayer = UnityHubVideoPlayerForm | UnityHubVideoPlayerRaw;

const UnityHubVideoPlayer = ({
  videoUrl,
  className,
  isListItem = false,
  isFromForm = false,
  videoErrorHandling,
}: UnityHubVideoPlayer) => {
  const [state, dispatch] = useVideo();

  function handlePlayStatus(action: "pause" | "play") {
    if (isListItem) return;
    if (action === "pause") {
      dispatch({ type: "pause" });
      dispatch({ type: "change-hold-time", playload: Date.now() });
    } else {
      dispatch({ type: "play" });
      if (Date.now() - state.holdTime < 500) {
        dispatch({ type: "change-mute" });
      }
    }
  }
  useEffect(() => {
    dispatch({ type: "clear-error" });
    if (isFromForm) {
      videoErrorHandling.clear();
    }
    dispatch({ type: "change-progress", playload: 0 });
  }, [videoUrl]);

  return (
    <div
      className={`flex overflow-hidden rounded-xl relative max-h-[45rem] ${className}`}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
        onMouseDown={handlePlayStatus.bind(null, "pause")}
        onMouseUp={handlePlayStatus.bind(null, "play")}
      >
        <ReactPlayer
          key={videoUrl}
          url={videoUrl}
          width={"100%"}
          height={"100%"}
          playing={state.isPlaying}
          playsinline
          fallback={<></>}
          muted={state.isMuted}
          config={{
            file: {
              forceVideo: true,
            },
          }}
          onEnded={() => {
            dispatch({ type: "pause" });
          }}
          progressInterval={10}
          onProgress={(e) => {
            dispatch({
              type: "change-progress",
              playload: +e.played.toFixed(4),
            });
          }}
          onBuffer={() => {
            dispatch({ type: "buffer" });
          }}
          onBufferEnd={() => {
            dispatch({ type: "clear-buffer" });
          }}
          onError={() => {
            dispatch({ type: "error" });
            if (isFromForm) {
              videoErrorHandling.set(
                "فایل انتخاب شده معتبر نیست یا مشکلی دارد"
              );
            }
          }}
        />

        {state.currentProgress !== 1 && state.currentProgress !== 0 && (
          <img
            className={`w-8 h-8 rounded-full transition-opacity absolute bottom-6 right-6 ${
              state.isMuted
                ? "opacity-100 duration-0"
                : "opacity-0 duration-700 delay-1000"
            }`}
            src={`/icons/${state.isMuted ? "muted" : "unmuted"}.svg`}
            alt={state.isMuted ? "muted" : "unmuted"}
            aria-label={state.isMuted ? "unmute button" : "mute button"}
          />
        )}
        {!state.hasError && (
          <div
            className={`h-1 rounded-sm bg-white transition-opacity duration-700 absolute bottom-0 inset-x-0 ${
              state.isPlaying ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="h-full w-full transition-transform ease-linear rounded-sm bg-primary-500"
              style={{
                transform: `scaleX(${state.currentProgress})`,
                transformOrigin: "left",
              }}
            />
          </div>
        )}
      </div>
      {!isListItem &&
        (state.hasError ? (
          <div className="absolute inset-0 rounded-xl grid place-items-center backdrop-blur-sm">
            <img
              className="w-14 h-14 cursor-pointer"
              src="/icons/error.svg"
              alt="ارور"
            />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {(state.currentProgress === 1 || state.currentProgress === 0) && (
              <motion.div
                key="play-state"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className={`absolute inset-0 rounded-xl grid place-items-center ${
                  state.currentProgress === 1 ? "backdrop-blur-sm" : ""
                }`}
              >
                <img
                  className="w-14 h-14 cursor-pointer"
                  onClick={() => {
                    if (isListItem) return;
                    dispatch({ type: "change-play" });
                  }}
                  src="/icons/play.svg"
                  alt="پخش"
                  aria-label="پخش"
                />
              </motion.div>
            )}
            {state.isBuffering && (
              <motion.div
                key="buffering-state"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 rounded-xl grid place-items-center"
              >
                <Spinner size={40} />
              </motion.div>
            )}
          </AnimatePresence>
        ))}
    </div>
  );
};

export default UnityHubVideoPlayer;
