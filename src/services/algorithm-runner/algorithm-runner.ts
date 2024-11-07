import { VisualizationResult } from "src/shared-types/visualization/VisualizationResult";


import { backendAdaptor } from "../adaptors/backend-adaptor";
import { LegacyVisualizationResult } from "src/shared-types/visualization/Legacy";
import fs from "node:fs";
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
    const { stdout, stderr } = await exec(this.getShellCommand(algorithm), {});

    console.log("Outputting");

    const legacyOutput = safeJsonParse<LegacyVisualizationResult>(stdout);
    if (legacyOutput !== undefined) {
      console.log("Sending");

      return backendAdaptor.visualizationResult(legacyOutput);
    }
    else {
      throw new Error("Backend sent gibberish");
    }
  }
  private dumpAlgorithmJson(algorithm: Algorithm) {
    fs.writeFile(
      "./src/services/algorithm-runner/test.json", JSON.stringify(algorithm),
      (error) => {
        console.log(`Cannot write file : ${error}`);
      });
  }
  private getShellCommand(algorithm: Algorithm) {
    return `echo '${JSON.stringify(algorithm).replace(/'/g, "'\\''")}' | 
            docker container run --rm -i syga-backend`;
  }


}

export { AlgorithmRunner, Algorithm };
