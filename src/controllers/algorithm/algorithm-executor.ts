import type { AbstractController } from "../abstract-controller";
import { Algorithm, AlgorithmRunner } from "../../services/algorithm-runner/algorithm-runner";

class AlgorithmExecutor implements AbstractController {
  async handleRequest(algorithm: Algorithm) {
    const runner = new AlgorithmRunner();
    return runner.run(algorithm);
  }
}

export const algorithmExecutor = new AlgorithmExecutor;
