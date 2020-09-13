import { Module } from '@nestjs/common';
import { AppController } from './controllers/app/app.controller';
import { AppService } from './services/app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameGateway } from './gateways/game/game.gateway';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway],
})
export class AppModule {}
