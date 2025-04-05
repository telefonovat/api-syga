import { AbstractController } from '../AbstractController';
import { AlgorithmRunner } from '#src/services/algorithm-runner/algorithm-runner';
import { VisualizationRequest } from '@telefonovat/syga--contract';
import express from 'express';

export default class AlgorithmExecuteController extends AbstractController {
  async handleExecuteRequest(
    request: express.Request,
    response: express.Response,
  ) {
    const requestBody = request.body;
    const visualizationRequest =
      requestBody.content as VisualizationRequest;

    const runner = new AlgorithmRunner();

    runner
      .run(visualizationRequest)
      .then((visualization) => {
        this.sendResponse(response, 200, visualization);
      })
      .catch((error) => {
        this.sendError(response, error);
      });
  }
}
