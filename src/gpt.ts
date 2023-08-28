import { ChatGoogleVertexAI } from 'langchain/chat_models/googlevertexai';
import { RetrievalQAChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { redis, redisVectorStore } from './redis';

const chatGoogle = new ChatGoogleVertexAI({
    temperature: 0.3
})

const template = new PromptTemplate({
    template: `
        Você responde perguntas sobre colchões.
        O usuário quer saber perguntas especifícas sobre os colchões Gazin.
        Use o conteúdo das transcrições para responder todas as perguntas.
        Se uma resposta sobre a pergunta não for encontrada, diga que você não tem resposta para essa pergunta, não tente inventar uma resposta.

        Trascrições: 
        {context}

        Pergunta: 
        {question}
    `.trim(), 
    inputVariables: ['context', 'question']
});

const chain = RetrievalQAChain.fromLLM(chatGoogle, redisVectorStore.asRetriever(), {
    prompt: template,
    returnSourceDocuments: true,
    verbose: true
});

async function main(){
    await redis.connect();

    const response = await chain.call({query: 'Qual a porcentagem de poliéster possuí o colchão?'});

    console.log(response);

    await redis.disconnect();
}

main();