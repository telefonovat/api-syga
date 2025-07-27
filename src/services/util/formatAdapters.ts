import {
  Edge,
  GraphComponent,
  GraphEdge,
  GraphType,
  GraphVertex,
  LegacyComponent,
  LegacyFrame,
  LegacyVisualizationResult,
  Node,
} from '@telefonovat/syga--contract';
import { VisualizationFrame } from '@telefonovat/syga--contract/domain/visualization/VisualizationFrame';
import { ExecuteAlgorithmSuccessResponse } from '@telefonovat/syga--contract/response/results';

function isLegacyFrame(object: any): object is LegacyFrame {
  return (
    'lineno' in object &&
    Array.isArray(object.lineno) &&
    typeof object.lineno[0] === 'number' &&
    (!('console_logs' in object) ||
      !object.console_logs ||
      typeof object.console_logs === 'string') &&
    'components' in object &&
    Array.isArray(object.components)
  );
}

function isLegacyVisualizationResult(
  object: any,
): object is LegacyVisualizationResult {
  return (
    'timestamp' in object &&
    typeof object.timestamp === 'string' &&
    'res' in object &&
    typeof object.res === 'string' &&
    (!('err' in object) ||
      !object.err ||
      typeof object.err === 'string') &&
    'alg_time' in object &&
    typeof object.alg_time === 'number' &&
    'parse_time' in object &&
    typeof object.parse_time === 'number' &&
    'elapsed' in object &&
    typeof object.elapsed === 'number' &&
    'frames' in object
  );
}

function toGraphType(inputType: LegacyComponent['type']): GraphType {
  switch (inputType) {
    case 'Graph':
      return GraphType.UNDIRECTED;
    case 'DiGraph':
      return GraphType.DIRECTED;
    default:
      return GraphType.UNDIRECTED;
  }
}

function toGraphVertex(inputVertex: Node): GraphVertex {
  return {
    id: inputVertex,
  };
}

function toGraphEdge(inputEdge: Edge): GraphEdge {
  return {
    start: toGraphVertex(inputEdge[0]),
    end: toGraphVertex(inputEdge[1]),
  };
}

/**
 * converts LegacyVisualizationResult to new type in contract repo
 */
export function fromLegacyVisualizationResult(
  input: LegacyVisualizationResult,
): ExecuteAlgorithmSuccessResponse['result'] {
  try {
    //Validation of top-level fields
    if (!isLegacyVisualizationResult(input)) {
      // TODO: Proper error typing
      throw Error(
        'Invalid top-level fields in visualization result from engine',
      );
    }

    //Validation of each frame
    const frames: VisualizationFrame[] = [];
    for (const legacyFrame of input.frames) {
      if (!isLegacyFrame(legacyFrame)) {
        // TODO: Proper error typing
        throw Error(
          'Invalid fields in visualization frame from engine',
        );
      }
      const components: GraphComponent[] = [];
      //Validate each component
      for (const legacyComponent of legacyFrame.components) {
        //TODO: validate

        const component: GraphComponent = {
          type: toGraphType(legacyComponent.type),
          vertices: legacyComponent.nodes.map((v) =>
            toGraphVertex(v),
          ),
          edges: legacyComponent.edges.map((e) => toGraphEdge(e)),
          style: {
            // TODO: Styles
            vertexColors: {},
            edgeColors: {},

            vertexShapes: {},
            edgeShapes: {},

            vertexLabels: {},
            edgeLabels: {},
          },
        };

        components.push(component);
      }
      const frame: VisualizationFrame = {
        lineNo: legacyFrame.lineno,
        consoleLogs: [legacyFrame.console_logs ?? ''],
        graphComponents: components,
      };
      frames.push(frame);
    }

    const result: ExecuteAlgorithmSuccessResponse['result'] = {
      timestamp: input.timestamp,
      response: input.res,
      ...(input.err && {
        errorMessage: input.err,
      }),
      algorithmTime: input.alg_time,
      parseTime: input.parse_time,
      elapsed: input.elapsed,
      frames: frames,
    };
    return result;
  } catch (e: any) {
    throw e;
  }
}
