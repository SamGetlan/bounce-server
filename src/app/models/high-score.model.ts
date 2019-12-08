import { Document, model, Model, models, Schema } from 'mongoose';

const powerUpSchema: Schema = new Schema({
  type: {
    required: true,
    type: String,
  },
  time: {
    required: true,
    type: Number,
  }
});

const highScoreSchema: Schema = new Schema({
  score: {
    required: true,
    type: Number,
  },
  time: {
    required: true,
    type: Number,
  },
  name: {
    required: true,
    type: String,
  },
  powerUps: [powerUpSchema],
});

export interface IPowerUp {
  type: string;
  time: number;
};

export interface IHighScore extends Document {
  score: number;
  time: number,
  name: string;
  powerUps: IPowerUp[];
};

export const HighScore: Model<IHighScore> = models.HighScore || model<IHighScore>('HighScore', highScoreSchema);