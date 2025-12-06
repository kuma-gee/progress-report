import React from "react";
import {
  useCurrentFrame,
  Img,
  staticFile,
  AbsoluteFill,
  useVideoConfig,
  Audio,
  interpolate,
  CalculateMetadataFunction,
} from "remotion";
import { z } from "zod";

const images = [
  "Moona_1.png",
  "Moona_2.png",
  "Moona_3.png",
  "Moona_4.png",
  "Moona_5.png",
  "Moona_6.png",
  "Moona_7.png",
  "Moona_8.png",
  "Moona_9.png",
  "Moona_10.png",
  "Moona_11.png",
  "Moona_12.png",
  "Moona_13.png",
  "Moona_14.png",
  "Moona_15.png",
  "Moona_16.png",
  "Moona_17.png",
  "Moona_17.png",
  "Moona_17.png",
];

export const drawingsSchema = z.object({
  secondsPerImage: z.number(),
  bgmFile: z.string(),
  bgmFadeInSeconds: z.number().optional(),
  bgmFadeOutSeconds: z.number().optional(),
  bgmOffsetSeconds: z.number().optional(),
});

export const calculateDrawingsMetadata: CalculateMetadataFunction<
  z.infer<typeof drawingsSchema>
> = async ({ props }) => {
  const fps = 30;
  return {
    fps,
    durationInFrames: images.length * fps * (props.secondsPerImage || 5),
  };
};

export const Drawings: React.FC<z.infer<typeof drawingsSchema>> = ({
  secondsPerImage = 5,
  bgmFile,
  bgmFadeInSeconds = 2,
  bgmFadeOutSeconds = 2,
  bgmOffsetSeconds = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const framesPerImage = secondsPerImage * fps;

  const currentImageIndex = Math.floor(frame / framesPerImage) % images.length;
  const currentImage = images[currentImageIndex];

  // Calculate volume for fade in and fade out
  const fadeInFrames = bgmFadeInSeconds * fps;
  const fadeOutFrames = bgmFadeOutSeconds * fps;

  const volume = interpolate(
    frame,
    [0, fadeInFrames, durationInFrames - fadeOutFrames, durationInFrames],
    [0, 0.03, 0.03, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill
      style={{
        flex: 1,
        backgroundColor: "#666",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Audio src={bgmFile} volume={volume} startFrom={bgmOffsetSeconds * fps} />
      <Img
        src={staticFile(`drawings/${currentImage}`)}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
    </AbsoluteFill>
  );
};
