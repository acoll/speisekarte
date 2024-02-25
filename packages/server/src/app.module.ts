import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { Subject, takeUntil } from 'rxjs';
import { inspect } from 'util';
import { ParserModule } from './features/parser/_module';
import { WeekPlanModule } from './features/planning/_module';
import { RecipesModule } from './features/recipes/_module';
import { SaveRecipeModule } from './features/save-recipe/_module';
import { ScraperModule } from './features/scraper/_module';
import { ShoppingListModule } from './features/shopping-list/_module';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CqrsModule.forRoot(),
    ScheduleModule.forRoot(),
    {
      global: true,
      module: PersistenceModule,
    },
    SaveRecipeModule,
    ScraperModule,
    ParserModule,
    RecipesModule,
    WeekPlanModule,
    ShoppingListModule,
  ],
})
export class AppModule {
  private destroy$ = new Subject<void>();

  constructor(private readonly bus: CommandBus) {
    this.bus.pipe(takeUntil(this.destroy$)).subscribe((command) => {
      console.log(
        'CMD::',
        command.constructor.name,
        inspect(command, {
          maxStringLength: 10,
          maxArrayLength: 1,
          colors: true,
        }),
      );
    });
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
