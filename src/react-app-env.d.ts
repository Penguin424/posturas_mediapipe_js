/// <reference types="react-scripts" />

interface Navigator {
  getUserMedia(
    options: { video?: boolean; audio?: boolean },
    success: (stream: any) => void,
    error?: (error: string) => void
  ): void;
}

interface CanvasRenderingContext2D {
  height: number;
  width: number;
}
