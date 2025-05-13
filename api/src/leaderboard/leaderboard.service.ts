import { faker } from '@faker-js/faker';
import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { randomCar } from 'src/utils/randomCar';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  private readonly leaderboardKey = "leaderboard"
  private redis: Redis
  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) { }


  async onModuleInit() {
    this.redis = this.redisService.getClient()
    await this.syncLeaderBoardFromDb()
  }

  async syncLeaderBoardFromDb() {
    const users = await this.prisma.users.findMany()
    const pipeline = this.redis.pipeline()
    users.forEach(user => {
      pipeline.zadd(this.leaderboardKey, user.score, user.gamertag)
    })
    await pipeline.exec()
  }

  async addOrUpdateUser() {
    
    const { score, gamertag } = await this.prisma.users.create({
      data: {
        gamertag: faker.person.firstName(),
        car: randomCar(),
        level: faker.number.int({ min: 1, max: 500 }),
        score: 1500000
      }
    })

    await this.redis.zadd(this.leaderboardKey, score, gamertag)
  }

  async getTopUsers(limit = 10) {
    const result = await this.redis.zrevrange(this.leaderboardKey, 0, limit, 'WITHSCORES');
    const users: { gamertag: string, score: number }[] = [];
    for (let i = 0; i < result.length; i += 2) {
      users.push({
        gamertag: result[i],
        score: Number(result[i + 1]),
      });
    }

    const gamertags = users.map(u => u.gamertag)
    const usersData = await this.prisma.users.findMany({
      where: { gamertag: { in: gamertags } },
      select: { gamertag: true, score: true, level: true, car: true }
    })
    return users.map(u => ({
      ...usersData.find(ud => ud.gamertag === u.gamertag),
      score: u.score
    }));
  }
}
