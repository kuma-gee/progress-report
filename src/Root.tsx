import "./index.css";
import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { calculateDrawingsMetadata, Drawings, drawingsSchema } from "./Drawings";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("week-3.mp4"),
          audio: staticFile("Apparition’s_Lullaby.mp3"),
          from: 250,
          to: 1300,
        }}
      />

      <Composition
        id="Drawings"
        component={Drawings}
        schema={drawingsSchema}
        calculateMetadata={calculateDrawingsMetadata}
        width={2480}
        height={3508}
        defaultProps={{
          secondsPerImage: 1,
          bgmFile: staticFile('bgm/SUMMER_TRIANGLE.mp3'),
        }}
      />
    </>
  );
};
