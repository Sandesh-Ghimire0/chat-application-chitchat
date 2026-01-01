import { createClient } from "redis";

class RedisService {
    private pub;
    private sub;

    constructor() {
        this.pub = createClient();
        this.sub = createClient();
    }

    async connect() {
        await this.pub.connect();
        await this.sub.connect();

        console.log("Redis server Connected ...!!");
    }

    subscribe(channel: string, handler: (message: string) => void) {
        this.sub.subscribe(channel, handler);
    }


    publish(channel: string, message: string){
        this.pub.publish(channel, message)
    }
}


export const redisService = new RedisService()