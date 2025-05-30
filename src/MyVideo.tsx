// src/MyVideo.tsx
import {
  Img,
  useVideoConfig,
  Audio,
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  // staticFile 
  // spring,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";

const MyVideo = ({ images, audioSrc, captions }: any) => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const transitionDuration = 20;
  const totalDuration = Math.ceil(captions[captions?.length - 1].end / 1000) * fps;
  const imageDuration = Math.floor((totalDuration + transitionDuration * (images?.length - 1)) / images?.length);

  const getCurrentCaption = () => {
    const currentTime = (frame / fps) * 1000;
    const currentCaption = captions.find(
      (word: any) => currentTime >= word.start && currentTime <= word.end
    );
    return currentCaption ? currentCaption.text : "";
  };

  const allTransitions: any = [
    wipe(),
    slide(),
    flip(),
    clockWipe({ width, height }),
    wipe(),
    slide()
  ];
  const getDurationFrames = () => {
    console.log("fps", fps);
    return Math.ceil(captions[captions?.length - 1]?.end / 1000) * fps;
    // return 30* fps;
  };
  return (
    <>
      <TransitionSeries>
        {images.flatMap((img: any, index: number) => {
          const startTime = (index * getDurationFrames()) / images?.length;
          const duration = getDurationFrames();
          const scale = interpolate(
            frame,
            [startTime, startTime + duration / 2, startTime + duration],
            index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );

          const transition = index < images.length - 1 ? (
            <TransitionSeries.Transition
              key={`trans-${index}`}
              presentation={allTransitions[index]}
              timing={linearTiming({ durationInFrames: transitionDuration })}
            />
          ) : null;

          const sequence = (
            <TransitionSeries.Sequence
              key={`seq-${index}`}
              durationInFrames={imageDuration}
            >
              <AbsoluteFill
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <Img
                  src={img}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale})`, // use static or dynamic scale if needed
                  }}
                />
                <AbsoluteFill
                  style={{
                    justifyContent: "center",
                    top: undefined,
                    bottom: 450,
                    height: 650,
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "120px",
                      fontWeight: "900",
                      fontFamily: "Arial Black, Impact, Arial, sans-serif",
                      color: "#00FFFF",
                      textShadow: "4px 4px 8px #ffffff",
                      fontStyle: "italic",
                      letterSpacing: "1px",
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      padding: "10px",
                      position: "absolute",
                      bottom: "10%",
                      left: 0,
                      right: 0,
                      margin: "0 auto",
                      width: "100%",
                    }}
                  >
                    {getCurrentCaption()}
                  </h2>
                </AbsoluteFill>
              </AbsoluteFill>
            </TransitionSeries.Sequence>
          );

          return [sequence, transition].filter(Boolean);
        })}
      </TransitionSeries>

      {/* Audio */}
      <Audio src={"https://my-auto-post-assets.s3.eu-north-1.amazonaws.com/audio.mp3"} delayRenderTimeoutInMilliseconds={60000} />
      <Audio
        src={"https://my-auto-post-assets.s3.eu-north-1.amazonaws.com/booktherental.mp3"}
        delayRenderTimeoutInMilliseconds={60000}
        volume={0.1}
        endAt={totalDuration}
      />
    </>
  );
};


export default MyVideo;