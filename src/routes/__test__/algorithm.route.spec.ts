import request from 'supertest';
import { app } from '#src/app';
import {
  ExecuteAlgorithmRequest,
  ApiErrorResponse,
} from '@telefonovat/syga--contract';
import { expect, describe, it } from 'vitest';
import { buildResponse } from './expectedResponses';

describe('/algorithm/build', () => {
  it('should return error response on empty request', async function () {
    const errorResponse: ApiErrorResponse = {
      success: false,
      errorMessages: ['Invalid body'],
    };
    const test = await request(app)
      .post('/algorithm/build')
      .send({})
      .expect(400);
    expect(test.body).toEqual(errorResponse);
  });
  it('should respond with correct body to valid response', async function () {
    const requestBody: ExecuteAlgorithmRequest = {
      mode: 'anonymous',
      code: "text = 'hello, stranger!'\n\nG = engine.DiGraph([(i + 1, i + 2) for i in range(len(text) - 1)])\n\nG.color_edges_by(lambda u, v, G: v if 'label' in G.nodes[v] else None)\nG.color_nodes_by(lambda v, G: v if 'label' in G.nodes[v] else None)\nG.label_nodes_by(lambda v, G: G.nodes[v]['label'] if 'label' in G.nodes[v] else ' ')\n\nfor i, symbol in enumerate(text):\n  G.nodes[(i + 1)]['label'] = symbol\n\nprint(text)",
    };
    const test = await request(app)
      .post('/algorithm/build')
      .send(requestBody)
      .expect(200);
    expect(test.body.success).toEqual(true);
    expect(test.body.result).toEqual({
      timestamp: expect.any(String),
      response: 'success',
      algorithmTime: expect.any(Number),
      parseTime: expect.any(Number),
      elapsed: expect.any(Number),
      frames: buildResponse.payload.frames,
    });
  });
});
