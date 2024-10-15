import { VisualizationResult } from "src/shared/VisualizationResult";
import { simpleGraph } from "../../../test/mock/testFrames";

class AlgorithmRunner {
  async run(): Promise<VisualizationResult> {
    console.log("Running algorithm");
    return {
      frames: simpleGraph,
    };
  }
}

export { AlgorithmRunner };
