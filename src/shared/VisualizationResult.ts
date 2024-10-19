import { Frame } from "./Frame"
export interface VisualizationResult {
  timestamp: string,
  response: string,
  error?: string,
  algTime: number,
  parseTime: number,
  elapsed: number,

  frames: Frame[],
}
