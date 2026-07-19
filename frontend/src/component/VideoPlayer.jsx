import React from "react";
import myVideo from "./video.mp4";

function VideoPlayer() {
  return (
    <div className="absolute bottom-6 right-6 w-[260px] md:w-[320px] lg:w-[350px]">
      <video
        src={myVideo}
        autoPlay
        loop
        muted
        controls
        className="w-full rounded-xl shadow-2xl border-2 border-white"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;