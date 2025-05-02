"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useAIChatStreamHandler from "@/hooks/useAIStreamHandler";
import { usePlaygroundStore } from "@/store";
import { SendIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

const ChatInput = () => {
  const { chatInputRef } = usePlaygroundStore();

  const { handleStreamResponse } = useAIChatStreamHandler();
  const [selectedAgent] = useQueryState("agent");
  const [inputMessage, setInputMessage] = useState("");
  const isStreaming = usePlaygroundStore((state) => state.isStreaming);

  const handleSubmit = async () => {
    if (!inputMessage.trim()) return;

    const currentMessage = inputMessage;
    setInputMessage("");

    try {
      await handleStreamResponse(currentMessage);
    } catch (error) {
      toast.error(
        `Error in handleSubmit: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <div className="relative mx-auto flex w-full max-w-3xl items-end justify-center gap-x-3">
      <Textarea
        placeholder={
          selectedAgent
            ? "Ask anything..."
            : "Select an agent to start chatting"
        }
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.nativeEvent.isComposing &&
            !e.shiftKey &&
            !isStreaming
          ) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        className="border-input bg-background text-foreground focus-visible:ring-ring min-h-[60px] w-full resize-none rounded-md border px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1"
        disabled={!selectedAgent}
        ref={chatInputRef}
      />
      <Button
        onClick={handleSubmit}
        disabled={!selectedAgent || !inputMessage.trim() || isStreaming}
        size="icon"
        className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 rounded-full"
      >
        {isStreaming ? (
          <span className="animate-spin">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          </span>
        ) : (
          <SendIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ChatInput;
