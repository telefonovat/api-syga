import { Document, model, Schema } from 'mongoose';

export interface Algorithm {
  uuid: string;
  code: string;
}

interface AlgorithmDocument extends Document, Algorithm {}

export const AlgorithmSchema = new Schema<AlgorithmDocument>({
  uuid: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

export const AlgorithmModel = model<AlgorithmDocument>(
  'Algorithm Model',
  AlgorithmSchema,
);
