import { faker } from '@faker-js/faker';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Users } from 'generated/prisma';
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
    const users = await this.prisma.users.findMany();
    for (const user of users) {
      await this.redis.zadd(this.leaderboardKey, user.score, `user:${user.id}`);
      await this.redis.set(`user:${user.id}`, JSON.stringify(user));
    }
  }

  async addOrUpdateUser() {

    const user = await this.prisma.users.create({
      data: {
        gamertag: faker.person.firstName(),
        car: randomCar(),
        level: faker.number.int({ min: 1, max: 500 }),
        score: 1500000
      }
    })

    await this.redis.zadd(this.leaderboardKey, user.score, `user:${user.id}`)
    await this.redis.set(`user:${user.id}`, JSON.stringify(user))
  }

  async getTopUsers(limit = 10): Promise<Users[]> {
    const results = await this.redis.zrevrange(this.leaderboardKey, 0, limit - 1, 'WITHSCORES');
    const users: Users[] = [];

    for (let i = 0; i < results.length; i += 2) {
      const member = results[i]
      const userDataString = await this.redis.get(member)

      let userData: Users | null;

      if (userDataString) {
        userData = JSON.parse(userDataString) as Users
      } else {
        const id = member.replace("user:", '')
        userData = await this.prisma.users.findUnique({ where: { id: parseInt(id) } })

        if (userData) {
          await this.redis.set(member, JSON.stringify(userData))
        }
      }

      if (userData) {
        users.push(userData,)
      }
    }
    return users;
  }
}
