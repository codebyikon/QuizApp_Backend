import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    AssessmentsModule,
    QuestionsModule,
    CategoriesModule,
    SubmissionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
