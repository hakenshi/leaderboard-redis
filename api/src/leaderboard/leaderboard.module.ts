import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { RedisModule } from 'src/redis/redis.module';
import { LeaderboardGateway } from './leaderboard.gateway';

@Module({
  imports: [RedisModule],
  controllers: [LeaderboardController],
  providers: [LeaderboardService, LeaderboardGateway],
})
export class LeaderboardModule { }
