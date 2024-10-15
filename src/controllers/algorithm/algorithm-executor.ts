import { AbstractController } from "../abstract-controller";
import { AlgorithmRunner } from "../../services/algorithm-runner/algorithm-runner";

class AlgorithmExecutor implements AbstractController {
  async handleRequest(body: { code: string }) {
    const runner = new AlgorithmRunner();
    return runner.run();
  }
}

export const algorithmExecutor = new AlgorithmExecutor;
