import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useVideoConfig,
} from "remotion";
import { TheBoldFont } from "../load-font";
import { fitText } from "@remotion/layout-utils";
import { makeTransform, scale, translateY } from "@remotion/animation-utils";

const fontFamily = TheBoldFont;

const container: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  top: 100,
  height: 150,
};

const DESIRED_FONT_SIZE = 120;

export const Page: React.FC<{
  readonly enterProgress: number;
  readonly exitProgress: number;
  readonly text: string;
}> = ({ enterProgress, exitProgress, text }) => {
  const { width } = useVideoConfig();

  const fittedText = fitText({
    fontFamily,
    text,
    withinWidth: width * 0.9,
    textTransform: "uppercase",
  });

  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

  // Checkbox sizing and stroke to match text style
  // const checkboxSize = fontSize * 0.7;
  // const strokeWidth = Math.max(6, Math.round(fontSize * 0.08));

  // Combine enter and exit animations
  const enterScale = interpolate(enterProgress, [0, 1], [0.8, 1]);
  const exitScale = interpolate(exitProgress, [0, 1], [0.8, 1]);
  const scaleValue = enterScale * exitScale;
  const translateYValue =
    interpolate(enterProgress, [0, 1], [50, 0]) +
    interpolate(exitProgress, [0, 1], [-50, 0]);

  // Checkmark drawing progress: delay a little so it draws after the text enters
  // const combinedProgress = enterProgress;
  // const CHECKMARK_DELAY = 0.8; // fraction of the animation to wait before starting the draw
  // const checkStrokeDashoffset = interpolate(
  //   combinedProgress,
  //   [0, CHECKMARK_DELAY, 1],
  //   [100, 100, 0],
  // );

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontSize,
          color: "white",
          WebkitTextStroke: "20px black",
          paintOrder: "stroke",
          transform: makeTransform([
            scale(scaleValue),
            translateY(translateYValue),
          ]),
          fontFamily,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Checkbox: styled to match the strong stroke/white fill of the text. */}
        {/* <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: checkboxSize,
            height: checkboxSize,
            background: "white",
            boxSizing: "border-box",
            border: `${strokeWidth}px solid black`,
            borderRadius: Math.round(checkboxSize * 0.12),
            marginRight: Math.max(12, Math.round(fontSize * 0.15)),
            marginBottom: Math.max(12, Math.round(fontSize * 0.15)),
            overflow: "hidden",
          }}
        >
          <svg
            width={checkboxSize}
            height={checkboxSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
          >
            <path
              d="M4 12l5 5L20 6"
              stroke="black"
              strokeWidth={Math.max(2, Math.round(strokeWidth * 0.6))}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={100}
              strokeDashoffset={checkStrokeDashoffset}
            />
          </svg>
        </span> */}

        <span
          style={{
            display: "inline",
            whiteSpace: "pre",
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
