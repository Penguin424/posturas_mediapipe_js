import * as poselib from "@mediapipe/pose";
import Matrix from "ml-matrix";

class PoseForVideoUtils {
  static getAngleFor3Points(
    artic1: poselib.NormalizedLandmark,
    artic2: poselib.NormalizedLandmark,
    artic3: poselib.NormalizedLandmark
  ): number {
    let p1 = new Matrix(1, 2);
    let p2 = new Matrix(1, 2);
    let p3 = new Matrix(1, 2);

    p1.set(0, 0, artic1.x);
    p1.set(0, 1, artic1.y);

    p2.set(0, 0, artic2.x);
    p2.set(0, 1, artic2.y);

    p3.set(0, 0, artic3.x);
    p3.set(0, 1, artic3.y);

    let radians =
      Math.atan2(p3.get(0, 1) - p2.get(0, 1), p3.get(0, 0) - p2.get(0, 0)) -
      Math.atan2(p1.get(0, 1) - p2.get(0, 1), p1.get(0, 0) - p2.get(0, 0));

    let degrees = (radians * 180) / Math.PI;

    if (degrees < 0) {
      degrees += 360;
    }

    // if (degrees > 0) {
    //   degrees = (degrees - 180) * -1;
    // }

    // if (degrees < 0) {
    //   degrees = degrees + 180;
    // }

    return degrees;
  }

  static getMidFor2Points(
    artic1: poselib.NormalizedLandmark,
    artic3: poselib.NormalizedLandmark
  ): poselib.NormalizedLandmark {
    let p1 = new Matrix(1, 2);
    let p3 = new Matrix(1, 2);

    p1.set(0, 0, artic1.x);
    p1.set(0, 1, artic1.y);

    p3.set(0, 0, artic3.x);
    p3.set(0, 1, artic3.y);

    let p2: poselib.NormalizedLandmark = {
      x: (p1.get(0, 0) + p3.get(0, 0)) / 2,
      y: (p1.get(0, 1) + p3.get(0, 1)) / 2,
      z: 0,
    };

    return p2;
  }
}

export default PoseForVideoUtils;
