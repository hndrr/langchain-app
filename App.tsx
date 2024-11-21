import { config } from "@gluestack-ui/config";
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
import "react-native-url-polyfill/auto";
import "text-encoding-polyfill";

import { Button, ButtonText, ScrollView, Text } from "@gluestack-ui/themed";
import { StatusBar } from "expo-status-bar";
import { BaseMessage } from "langchain/schema";
import { Bot, User } from "lucide-react-native";
import React, { useState } from "react";
import { GestureResponderEvent } from "react-native";
import { postChatMessage } from "./postChatMessage_llama";


type Message = Pick<BaseMessage, "content"> & {
  role: "ai" | "human";
};

export default function App() {
  const [text, setText] = useState<string>("");
  const [outputs, setOutputs] = useState<Message[]>([]);

  const handleSubmit = async (event: GestureResponderEvent) => {
    event.preventDefault();
    if (!text.trim()) return;

    const userMessage: Message = {
      content: text,
      role: "human",
    };

    setOutputs((prevOutputs) => [...prevOutputs, userMessage]); // ユーザーのメッセージを追加

    try {
      const response = await postChatMessage(text);
      console.log("response:", response);

      const aiMessage: Message = {
        content: response || "エラーが発生しました。",
        role: "ai",
      };

      setOutputs((prevOutputs) => [...prevOutputs, aiMessage]); // AIからの応答を追加
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setOutputs((prevOutputs) => [
        ...prevOutputs,
        { content: "エラーが発生しました。", role: "ai" },
      ]);
    } finally {
      setText(""); // 入力フィールドをリセット
    }
  };

  return (
    <GluestackUIProvider config={config}>
      <VStack width="$full" height="$full" paddingHorizontal="$5">
        <Heading
          size="lg"
          marginTop={60}
          paddingVertical={10}
          textAlign="center"
        >
          Simple Chatbot
        </Heading>
        <ScrollView h="$80" w="$full" marginBottom="$32">
          {outputs.length > 0 &&
            outputs.map((output, index) => {
              if (!output) {
                return <></>;
              }

              const isAI = output.role === "ai";
              const isUser = output.role === "human";
  
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
                    <VStack alignContent="center">
                      <Avatar
                        size="md"
                        bgColor="$indigo300"
                        borderColor="$indigo600"
                        borderWidth={2}
                      >
                        <Icon as={Bot} color="$indigo600" size="xl" />
                      </Avatar>
                      <Text fontSize="$md" textAlign="center">
                        AI
                      </Text>
                    </VStack>
                  )}
                  <Text
                    width="auto"
                    height="auto"
                    maxWidth={isUser ? "80%" : "$80"}
                    padding="$1"
                    textAlign={isUser ? "right" : "left"}
                    borderRadius="$md"
                    borderWidth={1}
                  >
                    {output.content}
                  </Text>
                  {isUser && (
                    <VStack>
                      <Avatar
                        size="md"
                        bgColor="$amber300"
                        borderColor="$amber600"
                        borderWidth={2}
                      >
                        <Icon as={User} color="$amber600" size="xl" />
                      </Avatar>
                      <Text fontSize="$md" textAlign="center">
                        User
                      </Text>
                    </VStack>
                  )}
                </HStack>
              );
            })}
        </ScrollView>
      </VStack>
      <HStack
        space="md"
        position="absolute"
        bottom="$0"
        paddingBottom="$16"
        width="$full"
        marginHorizontal={10}
        bg="$white"
      >
        <Input
          variant="outline"
          size="lg"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
          width="$4/6"
        >
          <InputField
            placeholder="promptを入力"
            returnKeyType="send"
            value={text}
            onChangeText={setText}
          />
        </Input>
        <Button size="lg" onPress={handleSubmit} width="$1/4" bg="$red500">
          <ButtonText>送信</ButtonText>
        </Button>
      </HStack>
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
