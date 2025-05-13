import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
    private client: Redis;

    onModuleInit() {
        this.client = new Redis()
    }

    getClient() {
        return this.client;
    }
}
