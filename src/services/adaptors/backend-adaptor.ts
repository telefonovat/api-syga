
import { VisualizationResult } from "src/shared-types/visualization/VisualizationResult";
import { Component } from "src/shared-types/visualization/Component";
import { Frame } from "src/shared-types/visualization/Frame";
import { LegacyFrame, LegacyComponent, LegacyVisualizationResult } from "src/shared-types/visualization/Legacy";


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
        consoleLogs: legacyFrame.console_logs ?? "",
        components: components,
      })
    }
    return {
      timestamp: input.timestamp,
      response: input.res,
      algorithmTime: input.alg_time,
      parseTime: input.parse_time,
      elapsed: input.elapsed,
      frames: frames,
    }


  }
}

const backendAdaptor = new BackendAdaptor();
export { backendAdaptor };
