import { useEffect } from "react";
import ReactPlayer from "react-player";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import PlayIcon from "/icons/play.svg";
import ErrorIcon from "/icons/error.svg";
import MutedIcon from "/icons/muted.svg";
import UnmutedIcon from "/icons/unmuted.svg";
import Spinner from "@/components/loaders/Spinner";
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
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!inView) {
      dispatch({ type: "pause" });
    }
  }, [inView]);

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
        onClick={() => {
          if (isListItem) return;
          dispatch({ type: "change-play" });
        }}
        ref={ref}
      >
        <ReactPlayer
          key={videoUrl}
          url={videoUrl}
          stopOnUnmount
          width={"100%"}
          height={"100%"}
          playing={state.isPlaying}
          playsinline
          // fallback={<></>}
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
            dispatch({ type: "buffering" });
          }}
          onBufferEnd={() => {
            dispatch({ type: "clear-buffer" });
          }}
          onError={() => {
            dispatch({ type: "error" });
            dispatch({ type: "pause" });
            if (isFromForm) {
              videoErrorHandling.set(
                "فایل انتخاب شده معتبر نیست یا مشکلی دارد"
              );
            }
          }}
        />

        <img
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "change-mute" });
          }}
          className={`w-6 h-6 md:w-8 md:h-8 rounded-full transition-opacity absolute bottom-2 right-1 md:bottom-5 md:right-4 ${
            state.isPlaying ? "opacity-40 hover:opacity-100" : "opacity-0"
          }`}
          src={state.isMuted ? MutedIcon : UnmutedIcon}
          alt={state.isMuted ? "muted" : "unmuted"}
          aria-roledescription="button"
          aria-label={state.isMuted ? "unmute button" : "mute button"}
        />
        {!state.hasError && (
          <div
            className={`h-1 rounded-sm bg-white transition-opacity absolute bottom-0 inset-x-0 ${
              state.isPlaying ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="h-full w-full transition-transform rounded-sm bg-primary-500"
              style={{
                transform: `scaleX(${state.currentProgress})`,
                transformOrigin: "left",
              }}
            />
          </div>
        )}
      </div>
      {!isListItem &&
        (state.hasError && !state.isPlaying ? (
          <div className="absolute inset-0 rounded-xl grid place-items-center backdrop-blur-sm">
            <div className="flex flex-col gap-4 items-center">
              <img src={ErrorIcon} className="w-14 h-14" alt="error" />
              <p>خطا در دریافت ویدیو</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {(state.currentProgress === 1 || state.currentProgress === 0) &&
              !state.isBuffering && (
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
                    src={PlayIcon}
                    alt="پخش"
                    aria-roledescription="button"
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
