import { handleGetAlgorithmFromGitRepo } from '#src/handlers/handleGetAlgorithmFromGitRepo';
import { Router } from 'express';
const githubAlgorithmsRouter = Router();

githubAlgorithmsRouter.get(
  '/:algorithmPath(*)',
  async (request, response) => {
    const algorithmPath = request.params.algorithmPath;
    console.log('[LOG] Attempt to get an algorithm from Github');

    handleGetAlgorithmFromGitRepo(request, response, {
      algorithmPath,
    });
  },
);

export { githubAlgorithmsRouter };
