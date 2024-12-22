import express from 'express';

const router = express.Router();

router.get(
  '/:namespace/:slug/:version',
  async (request, response) => {
    const slug = request.params.slug;
    const namespace = request.params.namespace;
    const version = request.params.version;
  },
);

export { router };
