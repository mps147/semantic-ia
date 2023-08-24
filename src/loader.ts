import path from "node:path";

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { TokenTextSplitter } from "langchain/text_splitter";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { GoogleVertexAIEmbeddings } from "langchain/embeddings/googlevertexai";
import { createClient } from "redis";

const loader = new DirectoryLoader(path.resolve(__dirname, "../tmp"), {
  ".json": (path) => new JSONLoader(path, "/text"),
});

async function load() {
  const docs = await loader.load();

  const splitter = new TokenTextSplitter({
    encodingName: "cl100k_base",
    chunkSize: 600,
    chunkOverlap: 0,
  });

  const spplitedDocuments = await splitter.splitDocuments(docs);
  const redis = createClient({
    url: "redis://127.0.0.1:6379",
  });

  await redis.connect();

  await RedisVectorStore.fromDocuments(
    spplitedDocuments,
    new GoogleVertexAIEmbeddings({
      endpoint: "AIzaSyBNTx0Qqxu4Pc0XfA4cft3QbD9z7Okz4ks",
    }),
    { indexName: "pdi-embeddings", redisClient: redis, keyPrefix: "pdi:" }
  );

  await redis.disconnect();
}

load();
