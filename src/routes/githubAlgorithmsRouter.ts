import { handleGetAlgorithmFromGitRepo } from '#src/handlers/handleGetAlgorithmFromGitRepo';
import { handleGetExercise } from '#src/handlers/handleGetExercise';
import { Router } from 'express';
const githubAlgorithmsRouter = Router();

githubAlgorithmsRouter.get(
  '/exercises/:exercisePath(*)',
  async (request, response) => {
    const exercisePath = request.params.exercisePath;

    await handleGetExercise(request, response, { exercisePath });
  },
);
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
