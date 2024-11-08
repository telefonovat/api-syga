import express from 'express';
import { algorithmRetriever } from '../services/database';

const router = express.Router();

router.get(
  '/:namespace/:slug/:version',
  async (request, response) => {
    const slug = request.params.slug;
    const namespace = request.params.namespace;
    const version = request.params.version;

    algorithmRetriever
      .retrieveOne({
        slug: slug,
        namespace: namespace,
        version: version,
      })
      .then((algorithm) => {
        response.status(200).send(algorithm);
      })
      .catch((error) => {
        console.warn(error);
        response.status(404).send({ error: error });
      });
  },
);

export { router };
