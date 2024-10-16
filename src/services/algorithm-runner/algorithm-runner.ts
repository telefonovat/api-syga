import { VisualizationResult } from "src/shared/VisualizationResult";
import { simpleGraph } from "../../../test/mock/testFrames";
import { environment } from "../../environment";

import { exec } from "child_process";

const { ENGINE_IMAGE } = environment;


class AlgorithmRunner {
  get engineShellCommand() {
    return `docker container run --rm -i ${ENGINE_IMAGE} < temp/temp.json`
  }
  async run(): Promise<VisualizationResult> {

    exec(this.engineShellCommand, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    })
    return {
      frames: simpleGraph,
    };
  }
}

export { AlgorithmRunner };
