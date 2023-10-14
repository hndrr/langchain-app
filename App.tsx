import "text-encoding-polyfill";
import "react-native-url-polyfill/auto";
import "web-streams-polyfill/dist/polyfill.min.js";
import {
  Avatar,
  GluestackUIProvider,
  HStack,
  Heading,
  Icon,
  Input,
  InputField,
  VStack,
} from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

import { StatusBar } from "expo-status-bar";
import { Button, ButtonText, Text, Box } from "@gluestack-ui/themed";
import { GestureResponderEvent, StyleSheet } from "react-native";
import React, { useState } from "react";
import { postChatMessage } from "./postChatMessage";
import { User } from "lucide-react-native";

export default function App() {
  const [text, setText] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const handleSubmit = async (event: GestureResponderEvent) => {
    setOutput("");
    const response = await postChatMessage(text);
    setOutput(response?.content ?? "");
    setText("");
  };

  return (
    <GluestackUIProvider config={config}>
      <VStack width="$full" height="$full" space="md" paddingHorizontal="$10">
        <Heading size="lg" marginTop={60}>
          Chatbot
        </Heading>
        <HStack space="md" height="$1/2">
          <Avatar
            size="md"
            bgColor="$indigo300"
            borderColor="$indigo600"
            borderWidth={2}
          >
            <Icon as={User} color="$indigo600" size="xl" />
          </Avatar>
          <Text width="$80" padding="$1">
            {output}
          </Text>
        </HStack>
        <HStack
          space="md"
          position="absolute"
          bottom={"$20"}
          width="$full"
          left="$10"
        >
          <Input
            variant="outline"
            size="lg"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            width="$4/5"
          >
            <InputField
              placeholder="promptを入力"
              returnKeyType="send"
              value={text}
              onChangeText={setText}
            />
          </Input>
          <Button size="lg" onPress={handleSubmit} width="$20" bg="$red500">
            <ButtonText>送信</ButtonText>
          </Button>
        </HStack>
      </VStack>
      <StatusBar style="auto" />
    </GluestackUIProvider>
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
