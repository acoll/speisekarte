import { Module } from '@nestjs/common';
import { OpenAIService } from './service';

@Module({
  imports: [OpenAIModule],
  exports: [OpenAIService],
  providers: [OpenAIService],
})
export class OpenAIModule {}
