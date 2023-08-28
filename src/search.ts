import { redis, redisVectorStore } from "./redis";

async function search(){
    await redis.connect();

    const response = await redisVectorStore.similaritySearchWithScore(
        'medida colchão ibiza',
        5
    );

    console.log(response);

    await redis.disconnect();
}

search();
