import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService extends OpenAI {
  constructor() {
    super({ apiKey: process.env.OPENAI_API_KEY });
  }
}
