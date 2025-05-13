import { Controller, Get, Post, Query } from '@nestjs/common';
import { LeaderboardGateway } from './leaderboard.gateway';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly leaderboardGateway: LeaderboardGateway
  ) { }

  @Post("update")
  async updateScore() {
    await this.leaderboardService.addOrUpdateUser()
    const top = await this.leaderboardService.getTopUsers(10)

    this.leaderboardGateway.emitLeaderBoard(top)

    return {
      message: 'Score Atualizado com sucesso.'
    }
  }

  @Get("top")
  async getTop(@Query('limit') limit = 10) {
    return this.leaderboardService.getTopUsers(Number(limit))
  }
}
