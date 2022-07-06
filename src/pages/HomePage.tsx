/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Pose } from "@mediapipe/pose";
import * as poselib from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import { InputImage } from "@mediapipe/control_utils";
import { Matrix } from "ml-matrix";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import PoseForVideoUtils from "../utils/PoseForVideoUtils";

const HomePage = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  let camera: cam.Camera | null = null;

  useEffect(() => {
    console.log(poselib.POSE_CONNECTIONS);
    const pose = new Pose({
      locateFile: (fileName: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${fileName}`;
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video!, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current?.video as InputImage });
        },
        height: webcamRef.current?.video?.videoHeight,
        width: webcamRef.current?.video?.videoWidth,
      });

      camera?.start();
    }
  }, []);

  const onResults = async (results: poselib.Results) => {
    if (canvasRef.current !== null) {
      canvasRef.current.width = webcamRef.current?.video?.videoWidth!;
      canvasRef.current.height = webcamRef.current?.video?.videoHeight!;

      let canvasElement = canvasRef.current;
      let canvasCtx = canvasElement.getContext("2d");

      canvasCtx?.save();
      canvasCtx?.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx?.drawImage(
        webcamRef.current?.video!,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      if (results.poseLandmarks) {
        let hombroIzquierdo = results.poseLandmarks[11];
        let hombroDerecho = results.poseLandmarks[12];
        let codoIzquierdo = results.poseLandmarks[13];
        let codoDerecho = results.poseLandmarks[14];
        let manoIzquierda = results.poseLandmarks[15];
        let manoDerecha = results.poseLandmarks[16];

        let caderaIzquierda = results.poseLandmarks[23];
        let caderaDerecha = results.poseLandmarks[24];
        let rodillaIzquierda = results.poseLandmarks[25];
        let rodillaDerecha = results.poseLandmarks[26];
        let pieIzquierdo = results.poseLandmarks[27];
        let pieDerecho = results.poseLandmarks[28];

        let espaldaAlta = PoseForVideoUtils.getMidFor2Points(
          hombroIzquierdo,
          hombroDerecho
        );

        let espaldaBaja = PoseForVideoUtils.getMidFor2Points(
          caderaIzquierda,
          caderaDerecha
        );

        let espaldaMedia = PoseForVideoUtils.getMidFor2Points(
          hombroIzquierdo,
          caderaDerecha
        );

        let puntos = [
          hombroIzquierdo, //0
          hombroDerecho, //1
          codoIzquierdo, //2
          codoDerecho, //3
          manoIzquierda, //4
          manoDerecha, //5
          caderaIzquierda, //6
          caderaDerecha, //7
          rodillaIzquierda, //8
          rodillaDerecha, //9
          pieIzquierdo, //10
          pieDerecho, //11

          espaldaAlta, //12
          espaldaMedia, //13
          espaldaBaja, //14
        ];

        let brazoIzquierdo = PoseForVideoUtils.getAngleFor3Points(
          hombroIzquierdo,
          codoIzquierdo,
          manoIzquierda
        );
        let brazoDerecho = PoseForVideoUtils.getAngleFor3Points(
          hombroDerecho,
          codoDerecho,
          manoDerecha
        );

        let piernaIzquierda = PoseForVideoUtils.getAngleFor3Points(
          caderaIzquierda,
          rodillaIzquierda,
          pieIzquierdo
        );
        let piernaDerecha = PoseForVideoUtils.getAngleFor3Points(
          caderaDerecha,
          rodillaDerecha,
          pieDerecho
        );

        let esplada = PoseForVideoUtils.getAngleFor3Points(
          espaldaAlta,
          espaldaMedia,
          espaldaBaja
        );

        let angulos = {
          angleCodoIzquierdo: brazoIzquierdo,
          angleCodoDerecho: brazoDerecho,
          angleRodillaIzquierda: piernaIzquierda,
          angleRodillaDerecha: piernaDerecha,
          angleEspalda: esplada,
        };

        console.log("Angulos: ", angulos);

        drawLandmarks(canvasCtx!, puntos, {
          color: "#00FFFF",
          lineWidth: 4,
        });

        drawConnectors(
          canvasCtx!,
          puntos,
          [
            [0, 2],
            [2, 4],
            [0, 4],

            [1, 3],
            [3, 5],
            [1, 5],

            [12, 13],
            [13, 14],

            [6, 8],
            [8, 10],
            [6, 10],

            [7, 9],
            [9, 11],
            [7, 11],
          ],
          {
            color: "#FFFFFF",
            lineWidth: 4,
          }
        );

        canvasCtx!.restore();
      }
    }
  };

  //   function degrees(radians: number) {
  //     var pi = Math.PI;
  //     return radians * (180 / pi);
  //   }

  return (
    <div>
      <div className="h-screen bg-cyan-200 p-2">
        <div className="grid grid-rows-2 grid-flow-col gap-2 h-full">
          <div className="grid grid-cols-2 gap-2 h-full">
            <div className="bg-black relative w-full h-full">
              {/* absolute mr-auto ml-auto left-0 ring-0 text-center z-10 */}
              <Webcam
                ref={webcamRef}
                className=" h-full w-full absolute mr-auto ml-auto top-0 bottom-0 left-0 ring-0 text-center z-10"
              />
              <canvas
                ref={canvasRef}
                className="h-full w-full absolute mr-auto ml-auto left-0 ring-0 text-center z-10"
              ></canvas>
            </div>
            <div className="bg-red-900 flex justify-center items-center flex-col"></div>
          </div>
          <div className="bg-green-900 "></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

//   const handleGetVideo = async () => {
//     console.log("asdadas");

//     if (videoRef) {
//       const canv = document.getElementById("canvas") as HTMLCanvasElement;
//       const context = canv.getContext("2d");

//       canv.width = 412;
//       canv.height = 384;

//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       videoRef.srcObject = stream;
//       videoRef.play();

//       let interval = setInterval(() => {
//         const canv = document.getElementById("canvas") as HTMLCanvasElement;
//         context!.drawImage(
//           document.getElementById("video") as HTMLVideoElement,
//           0,
//           0,
//           canv.height,
//           canv.width
//         );

//         socket!.emit("message", canv.toDataURL("image/jpeg"));
//       }, 30);
//       setInter(interval);
//     }
//   };
