import { StatusBar } from "expo-status-bar";
// import { OPENAI_API_KEY } from "module:react-native-dotenv";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useState, useCallback } from "react";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage } from "langchain/schema";

import "text-encoding-polyfill";
import "react-native-url-polyfill/auto";

export default function App() {
  const [text, setText] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  const handleSubmit = useCallback(async () => {
    setOutput("");
    const model = new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
    });
    try {
      const response = await model.call([new HumanChatMessage(text)]);
      setOutput(response.text);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        returnKeyType="send"
        style={styles.text}
        value={text}
        placeholder="promptを入力してください。"
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
      />
      <Text style={styles.text}>{output}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    borderWidth: 1,
    width: "80%",
    padding: 10,
    marginVertical: 20,
  },
});
