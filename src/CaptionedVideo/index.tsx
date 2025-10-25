import { useCallback, useEffect, useState } from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  cancelRender,
  OffthreadVideo,
  Sequence,
  useDelayRender,
  useVideoConfig,
  watchStaticFile,
  Html5Audio,
} from "remotion";
import { z } from "zod";
import SubtitlePage from "./SubtitlePage";
import { loadFont } from "../load-font";

export type SubtitleProp = {
  startInSeconds: number;
  text: string;
};

export type VideoCaption = {
  text: string;
  startMs: number;
};

export const captionedVideoSchema = z.object({
  src: z.string(),
  audio: z.string(),
  from: z.number().optional(),
  to: z.number().optional(),
  bgmFadeOutOffsetSeconds: z.number().optional(),
});

export const calculateCaptionedVideoMetadata: CalculateMetadataFunction<
  z.infer<typeof captionedVideoSchema>
> = async ({ props }) => {
  const fps = 30;
  const from = props?.from ?? 0;
  const to = props?.to ?? 0;

  return {
    fps,
    durationInFrames: to - from,
  };
};

// How many captions should be displayed at a time?
// Try out:
// - 1500 to display a lot of words at a time
// - 200 to only display 1 word at a time
const SWITCH_CAPTIONS_EVERY_MS = 1200;

export const CaptionedVideo: React.FC<z.infer<typeof captionedVideoSchema>> = ({
  src,
  from,
  to,
  audio,
  bgmFadeOutOffsetSeconds,
}) => {
  const [subtitles, setSubtitles] = useState<VideoCaption[]>([]);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());
  const { fps } = useVideoConfig();
  const { durationInFrames } = useVideoConfig();

  const subtitlesFile = src
    .replace(/.mp4$/, ".json")
    .replace(/.mkv$/, ".json")
    .replace(/.mov$/, ".json")
    .replace(/.webm$/, ".json");

  const fetchSubtitles = useCallback(async () => {
    try {
      await loadFont();
      const res = await fetch(subtitlesFile);
      const data = (await res.json()) as VideoCaption[];
      setSubtitles(data);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [handle, subtitlesFile, continueRender]);

  useEffect(() => {
    fetchSubtitles();

    const c = watchStaticFile(subtitlesFile, () => {
      fetchSubtitles();
    });

    return () => {
      c.cancel();
    };
  }, [fetchSubtitles, src, subtitlesFile]);

  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <Html5Audio
        src={audio}
        trimBefore={130}
        volume={(f) => {
          const FADE_SECONDS = 3;
          const baseVolume = 0.05;
          const fadeFrames = Math.max(1, Math.round(FADE_SECONDS * fps));
          const offsetSecs = typeof bgmFadeOutOffsetSeconds === "number" ? bgmFadeOutOffsetSeconds : 0;
          const offsetFrames = Math.max(0, Math.round(offsetSecs * fps));

          const inFactor = Math.min(1, f / fadeFrames);
          // start fading out earlier by subtracting offsetFrames from remaining frames
          const remaining = durationInFrames - f - offsetFrames;
          const outFactor = Math.min(1, Math.max(0, remaining / fadeFrames));
          return baseVolume * inFactor * outFactor;
        }}
      />
      <AbsoluteFill>
        <OffthreadVideo
          style={{
            objectFit: "cover",
            height: "100%",
          }}
          src={src}
          trimBefore={from}
          trimAfter={to}
        />
      </AbsoluteFill>
      {subtitles.map((page, index) => {
        const nextPage = subtitles[index + 1] ?? null;
        const subtitleStartFrame = (page.startMs / 1000) * fps;
        const subtitleEndFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          subtitleStartFrame + SWITCH_CAPTIONS_EVERY_MS,
        );
        const durationInFrames = subtitleEndFrame - subtitleStartFrame;
        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            from={subtitleStartFrame}
            durationInFrames={durationInFrames}
          >
            <SubtitlePage key={index} text={page.text} />;
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
