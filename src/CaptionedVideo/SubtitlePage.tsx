import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Page } from "./Page";

const SubtitlePage: React.FC<{ readonly text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
    durationInFrames: 10,
  });

  const exit = spring({
    frame: Math.max(0, durationInFrames - frame),
    fps,
    config: {
      damping: 200,
    },
    durationInFrames: 10,
  });

  return (
    <AbsoluteFill>
      <Page enterProgress={enter} exitProgress={exit} text={text} />
    </AbsoluteFill>
  );
};

export default SubtitlePage;
