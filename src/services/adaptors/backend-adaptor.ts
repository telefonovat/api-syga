import { Edge } from "src/shared/Edge";
import { Node } from "src/shared/Node";
import { Frame } from "src/shared/Frame";
import { VisualizationResult } from "src/shared/VisualizationResult";
import { Component } from "src/shared/Component";

interface LegacyFrame {
  lineno: number[],
  console_logs: string,
  components: LegacyComponent[],
}

interface LegacyComponent {
  nodes: Node[],
  edges: Edge[],
  style: {
    node_colors: { [key: Node]: string },
    edge_colors: { [key: Node]: { [key: Node]: string } },
  },
}

export interface LegacyVisualizationResult {

  timestamp: string,
  res: string,
  err?: string,
  alg_time: number,
  parse_time: number,
  elapsed: number,
  frames: LegacyFrame[],
}
class BackendAdaptor {
  convertToVisualizationResult(input: LegacyVisualizationResult): VisualizationResult {
    const frames: Frame[] = [];
    for (const legacyFrame of input.frames) {
      const components: Component[] = [];
      for (const legacyComponent of legacyFrame.components) {
        components.push({
          nodes: legacyComponent.nodes,
          edges: legacyComponent.edges,
          style: {
            nodeColors: legacyComponent.style.node_colors,
            edgeColors: legacyComponent.style.edge_colors,
          }
        });
      }
      frames.push({
        lineNo: legacyFrame.lineno,
        consoleLogs: legacyFrame.console_logs,
        components: components,
      })
    }
    return {
      timestamp: input.timestamp,
      response: input.res,
      algTime: input.alg_time,
      parseTime: input.parse_time,
      elapsed: input.elapsed,
      frames: frames,
    }


  }
}

const backendAdaptor = new BackendAdaptor();
export { backendAdaptor };
