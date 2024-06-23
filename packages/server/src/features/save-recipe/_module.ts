import { Module } from '@nestjs/common';
import { PersistenceModule } from '~/persistence/_module';
import { SaveRecipeController } from './controller';
import { SaveRecipeHandler } from './handler';

@Module({
  imports: [PersistenceModule],
  controllers: [SaveRecipeController],
  providers: [SaveRecipeHandler],
})
export class SaveRecipeModule {}
