import { ExecuteAlgorithmRequest } from '@telefonovat/syga--contract';

function isValidMode(
  mode: string,
): mode is ExecuteAlgorithmRequest['mode'] {
  return mode === 'anonymous' || mode === 'named';
}
export function isExecuteAlgorithmRequest(
  arg: any,
): arg is ExecuteAlgorithmRequest {
  return (
    arg !== undefined &&
    typeof arg === 'object' &&
    arg.mode !== undefined &&
    isValidMode(arg.mode) &&
    arg.code !== undefined &&
    typeof arg.code === 'string'
  );
}
