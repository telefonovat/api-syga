import { VisualizationResult } from '@telefonovat/syga--contract';
import { Component } from '@telefonovat/syga--contract';
import { Frame } from '@telefonovat/syga--contract';
import {
  LegacyVisualizationResult,
  isLegacyVisualizationResult,
  isLegacyFrame,
} from '@telefonovat/syga--contract';

class BackendAdaptor {
  visualizationResult(input: object): VisualizationResult {
    try {
      //Validation of fields
      if (!isLegacyVisualizationResult(input)) {
        console.warn(
          'Invalid fields in visualization result from engine',
        );
        console.log(input);
        throw Error('Invalid visualization results');
      }

      const validatedInput = input as LegacyVisualizationResult;

      //Validation of each frame
      const frames: Frame[] = [];
      for (const legacyFrame of input.frames) {
        if (!isLegacyFrame(legacyFrame)) {
          console.warn(
            'Invalid fields in visualization frame from engine',
          );
          throw Error('Invalid visualization frame');
        }
        const components: Component[] = [];
        //Validate each component
        for (const legacyComponent of legacyFrame.components) {
          //TODO: validate

          const component: Component = {
            type: legacyComponent.type,
            nodes: [...legacyComponent.nodes],
            edges: [...legacyComponent.edges],
            style: {
              nodeColors: { ...legacyComponent.style.node_colors },
              edgeColors: { ...legacyComponent.style.edge_colors },
              nodeShapes: { ...legacyComponent.style.node_shapes },
              edgeShapes: { ...legacyComponent.style.edge_shapes },
              nodeLabels: { ...legacyComponent.style.node_labels },
              edgeLabels: { ...legacyComponent.style.edge_labels },
            },
          };

          components.push(component);
        }
        const frame: Frame = {
          lineNo: legacyFrame.lineno,
          consoleLogs: legacyFrame.console_logs ?? '',
          components: components,
        };
        frames.push(frame);
      }

      const result: VisualizationResult = {
        timestamp: validatedInput.timestamp,
        response: validatedInput.res,
        ...(validatedInput.err && {
          errorMessage: validatedInput.err,
        }),
        algorithmTime: validatedInput.alg_time,
        parseTime: validatedInput.parse_time,
        elapsed: validatedInput.elapsed,
        frames: frames,
      };
      return result;
    } catch (e: any) {
      throw e;
    }
  }
}

const backendAdaptor = new BackendAdaptor();
export { backendAdaptor };
