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
import { BaseMessage } from "langchain/schema";

type Message = Pick<BaseMessage, "content" | "_getType">;

export default function App() {
  const [text, setText] = useState<string>("");
  const [outputs, setOutputs] = useState<Message[]>([]);

  const handleSubmit = async (event: GestureResponderEvent) => {
    const userMessage: Message = {
      content: text,
      _getType: () => "human",
    };
    setOutputs([...outputs, userMessage]);
    const response = await postChatMessage(text);
    setOutputs((prevOutputs) => [...prevOutputs, response as Message]);
    setText("");
  };

  return (
    <GluestackUIProvider config={config}>
      <VStack width="$full" height="$full" paddingHorizontal="$5">
        <Heading size="lg" marginTop={60}>
          Simple Chatbot
        </Heading>
        {outputs.length > 0 &&
          outputs.map((output, index) => {
            if (!output) {
              return <></>;
            }

            const isAI = output._getType() === "ai";
            const isUser = output._getType() === "human";

            return (
              <HStack
                space="md"
                key={index}
                width="$full"
                padding="$2"
                borderRadius="$md"
                bgColor="$gray100"
                justifyContent={isAI ? "flex-start" : "flex-end"}
              >
                {isAI && (
                  <Avatar
                    size="md"
                    bgColor="$indigo300"
                    borderColor="$indigo600"
                    borderWidth={2}
                  >
                    <Icon as={User} color="$indigo600" size="xl" />
                  </Avatar>
                )}
                <Text
                  width="auto"
                  maxWidth={isUser ? "80%" : "$80"}
                  padding="$1"
                  textAlign={isUser ? "right" : "left"}
                  borderRadius="$md"
                  borderWidth={1}
                >
                  {output.content}
                </Text>
                {isUser && (
                  <Avatar
                    size="md"
                    bgColor="$amber300"
                    borderColor="$amber600"
                    borderWidth={2}
                  >
                    <Icon as={User} color="$amber600" size="xl" />
                  </Avatar>
                )}
              </HStack>
            );
          })}
        <HStack
          space="md"
          position="absolute"
          bottom={"$20"}
          width="$full"
          left="$3"
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
