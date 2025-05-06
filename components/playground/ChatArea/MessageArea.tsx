"use client";

import ScrollToBottom from "@/components/playground/ChatArea/ScrollToBottom";
import { usePlaygroundStore } from "@/store";
import { StickToBottom } from "use-stick-to-bottom";
import Messages from "./Messages";

const MessageArea = () => {
  const { messages } = usePlaygroundStore();

  return (
    <StickToBottom
      className="relative flex min-h-0 flex-grow flex-col overflow-auto"
      resize="smooth"
      initial="smooth"
    >
      <StickToBottom.Content className="flex min-h-full flex-col justify-center">
        <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
          <Messages messages={messages} />
        </div>
      </StickToBottom.Content>
      <ScrollToBottom />
    </StickToBottom>
  );
};

export default MessageArea;
