// import { OPENAI_API_KEY } from "module:react-native-dotenv";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseMessage, HumanMessage } from "langchain/schema";

export const postChatMessage = async (
  text: string
): Promise<BaseMessage | undefined> => {
  const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  try {
    const model = new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
    });
    return await model.call([new HumanMessage(text)]);
  } catch (e) {
    console.error(e);
  }
};
