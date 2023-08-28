
import { GoogleVertexAIEmbeddings } from "langchain/embeddings/googlevertexai";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { createClient } from "redis";



export const redis = createClient({
    url: "redis://127.0.0.1:6379",
});


export const redisVectorStore = new RedisVectorStore(
    new GoogleVertexAIEmbeddings(),
    { indexName: "pdi-embeddings", redisClient: redis, keyPrefix: "pdi:" }
);

