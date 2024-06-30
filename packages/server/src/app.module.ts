import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { Subject, takeUntil } from 'rxjs';
import { Command } from './common/command';
import { ParserModule } from './features/parser/_module';
import { WeekPlanModule } from './features/planning/_module';
import { RecipesModule } from './features/recipes/_module';
import { SaveRecipeModule } from './features/save-recipe/_module';
import { ScraperModule } from './features/scraper/_module';
import { ShoppingListModule } from './features/shopping-list/_module';
import { JwtMiddleware } from './jwt.middleware';
import { LoggingMiddleware } from './logging.middleware';
import { PersistenceModule } from './persistence/_module';

console.log(process.env.OPENAI_API_KEY);

@Module({
  imports: [
    JwtModule.register({
      publicKey: process.env.JWT_PUBLIC_KEY!,
      verifyOptions: {
        algorithms: ['RS256'],
      },
    }),
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
  private readonly logger = new Logger(AppModule.name);

  private destroy$ = new Subject<void>();

  constructor(private readonly bus: CommandBus) {
    this.bus.pipe(takeUntil(this.destroy$)).subscribe((command) => {
      const cmd = command as Command<any>;
      this.logger.log(
        `Command [${cmd.constructor.name}] tenantId=${cmd.tenantId}`,
      );
    });
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
