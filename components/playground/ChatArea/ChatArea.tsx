"use client";

import { Button } from "@/components/ui/button";
import useChatActions from "@/hooks/useChatActions";
import { usePlaygroundStore } from "@/store";
import ChatInput from "./ChatInput";
import MessageArea from "./MessageArea";
import SettingsDialog from "./SettingsDialog";

const ChatArea = () => {
  const { messages } = usePlaygroundStore();
  const { clearChat, focusChatInput } = useChatActions();
  const handleNewChat = () => {
    clearChat();
    focusChatInput();
  };

  return (
    <main className="bg-card relative flex flex-grow flex-col overflow-hidden">
      {" "}
      <div className="border-border flex items-center border-b px-4 py-2">
        <h1 className="text-foreground flex-1 text-lg font-semibold">
          Chat Assistant
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleNewChat}
            disabled={messages.length === 0}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs">New Chat</span>
          </Button>
          <SettingsDialog />
        </div>
      </div>
      <MessageArea />
      <div className="border-border bg-card sticky bottom-0 border-t px-4 py-3">
        <ChatInput />
      </div>
    </main>
  );
};

export default ChatArea;
