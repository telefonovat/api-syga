import { Document, model, Schema } from 'mongoose';
import { Algorithm } from '#src/shared-types/user/Algorithm';

interface AlgorithmDocument extends Document, Algorithm {}

export const AlgorithmSchema = new Schema<AlgorithmDocument>(
  {
    uuid: {
      type: String,
      required: true,
    },
    creatorUsername: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    isPublic: {
      type: Boolean,
      required: true,
    },
  },
  { collection: 'algorithms' },
);

export const AlgorithmModel = model<AlgorithmDocument>(
  'Algorithm Model',
  AlgorithmSchema,
);
