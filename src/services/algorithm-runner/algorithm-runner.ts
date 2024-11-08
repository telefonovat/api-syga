import { VisualizationResult } from 'src/shared-types/visualization/VisualizationResult';
import { VisualizationRequest } from 'src/shared-types/visualization/VisualizationRequest';

import { backendAdaptor } from '../adaptors/backend-adaptor';
import { LegacyVisualizationResult } from 'src/shared-types/visualization/Legacy';
import { exec } from '../util/exec';
const safeJsonParse = <T>(str: string) => {
  try {
    const jsonValue: T = JSON.parse(str);

    return jsonValue;
  } catch {
    return undefined;
  }
};
class AlgorithmRunner {
  async run(
    visualizationRequest: VisualizationRequest,
  ): Promise<VisualizationResult> {
    const { stdout, stderr } = await exec(
      this.getShellCommand(visualizationRequest),
      {},
    );

    //Legacy output format by previous developer
    const legacyOutput =
      safeJsonParse<LegacyVisualizationResult>(stdout);
    if (legacyOutput !== undefined) {
      return backendAdaptor.visualizationResult(legacyOutput);
    } else {
      throw new Error('Backend sent gibberish');
    }
  }
  private getShellCommand(
    visualizationRequest: VisualizationRequest,
  ) {
    return `echo '${JSON.stringify(visualizationRequest).replace(/'/g, "'\\''")}' | 
            docker container run --rm -i syga-backend`;
  }
}

export { AlgorithmRunner };
