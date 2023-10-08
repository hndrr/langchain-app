import "text-encoding-polyfill";
import "react-native-url-polyfill/auto";
import "web-streams-polyfill/dist/polyfill.min.js";
// import "readable-stream";
// import "web-streams-polyfill/ponyfill";

import { StatusBar } from "expo-status-bar";
import {
  Button,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { postChatMessage } from "./generateChatMessage";

export default function App() {
  const [text, setText] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const handleSubmit = async (event: GestureResponderEvent) => {
    setOutput("");
    const response = await postChatMessage(text);
    setOutput(response?.content ?? "");
  };

  return (
    <View style={styles.container}>
      <TextInput
        returnKeyType="send"
        style={styles.text}
        value={text}
        placeholder="promptを入力"
        onChangeText={setText}
      />
      <Button title="送信" onPress={handleSubmit} />
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
