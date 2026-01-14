import { Request, Response } from 'express';
import { sendResponse } from './sendResponse';
import { GetIFExerciseSuccessBody } from '@telefonovat/syga--contract';

interface GetExerciseOptions {
  exercisePath: string;
}

export async function handleGetExercise(
  _request: Request,
  response: Response,
  { exercisePath }: GetExerciseOptions,
) {
  try {
    const prefix =
      'https:/raw.githubusercontent.com/telefonovat/syga--algorithms/main/exercises';
    const optionsRes = await fetch(
      `${prefix}/${exercisePath}/options.json`,
    );
    const algorithmRes = await fetch(
      `${prefix}/${exercisePath}/algorithm.py`,
    );
    const markdownRes = await fetch(
      `${prefix}/${exercisePath}/text.md`,
    );

    if (!optionsRes) {
      throw new Error('Options json not found');
    }
    if (!algorithmRes) {
      throw new Error('Algorithm file not found');
    }
    if (!markdownRes) {
      throw new Error('Markdown text not found');
    }

    const options = await optionsRes.json();
    const algorithm = await algorithmRes.text();
    const markdown = await markdownRes.text();

    const responseBody: GetIFExerciseSuccessBody = {
      options,
      algorithm,
      markdowntext: markdown,
    };

    sendResponse(response, {
      statusCode: 200,
      content: responseBody,
    });
  } catch (error) {}
}
