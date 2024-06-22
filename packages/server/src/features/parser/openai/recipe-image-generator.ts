import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OpenAIService } from '~/openai/service';

export abstract class RecipeImageGenerator {
  abstract generateImage(recipeName: string): Promise<Buffer>;
}

@Injectable()
export class OpenAIRecipeImageGenerator extends RecipeImageGenerator {
  constructor(private readonly openai: OpenAIService) {
    super();
  }

  async generateImage(recipeName: string) {
    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: this.prompt(recipeName),
      n: 1,
      size: '1024x1024',
      style: 'natural',
    });

    const url = response.data[0].url;

    if (!url) {
      throw new Error('Failed to generate image');
    }

    const buffer = await this.downloadImage(url);

    return buffer;
  }

  private prompt(recipeName: string) {
    return `${recipeName}. photorealistic, homemade`;
  }

  private async downloadImage(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  }
}

@Injectable()
export class MockRecipeImageGenerator extends RecipeImageGenerator {
  async generateImage() {
    return Buffer.from('');
  }
}
