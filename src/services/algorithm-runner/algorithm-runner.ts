import { VisualizationResult } from "src/shared/VisualizationResult";
import { simpleGraph } from "../../../test/mock/testFrames";

import childProcess from "child_process";
import { backendAdaptor, LegacyVisualizationResult } from "../adaptors/backend-adaptor";
const safeJsonParse = <T>(str: string) => {
  try {
    const jsonValue: T = JSON.parse(str);

    return jsonValue;
  } catch {
    return undefined;
  }
};
const exec = (command: string, options = {}) =>
  new Promise<{ stdout: string, stderr: string }>((resolve, reject) =>
    childProcess.exec(command, options, (error, stdout, stderr) =>
      error ? reject(error) : resolve({ stdout, stderr })
    )
  );
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
