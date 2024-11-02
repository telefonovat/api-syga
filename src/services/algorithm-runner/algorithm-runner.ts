import { VisualizationResult } from "src/shared-types/visualization/VisualizationResult";


import { backendAdaptor, LegacyVisualizationResult } from "../adaptors/backend-adaptor";

import { exec } from "../util/exec";
const safeJsonParse = <T>(str: string) => {
  try {
    const jsonValue: T = JSON.parse(str);

    return jsonValue;
  } catch {
    return undefined;
  }
};
interface Algorithm {
  code: string,
}
class AlgorithmRunner {
  async run(algorithm: Algorithm): Promise<VisualizationResult> {
    const { stdout, stderr } = await exec(this.shellCommand, {});


    const legacyOutput = safeJsonParse<LegacyVisualizationResult>(stdout);
    if (legacyOutput !== undefined) {

      return backendAdaptor.convertToVisualizationResult(legacyOutput);
    }
    else {
      throw new Error("Backend sent gibberish");
    }
  }
  get shellCommand() {
    return "docker container run --rm -i syga-backend < ./src/services/algorithm-runner/test.json";
  }


}

export { AlgorithmRunner, Algorithm };
