import request from 'supertest';
import { app } from '#src/app';
import { SygaApiErrorResponse } from '@telefonovat/syga--contract';

describe('/algorithm/execute', () => {
  describe('POST', () => {
    it('should return error response on empty request', async () => {
      const errorResponse: SygaApiErrorResponse = {
        success: false,
        errorMessages: ['empty body'],
      };
      const test = await request(app)
        .post('/algorithm/execute')
        .send({})
        .expect(400);
      expect(test.body).toEqual(errorResponse);
    });
  });
});
