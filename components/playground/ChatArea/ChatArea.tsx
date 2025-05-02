"use client";

import ChatInput from "./ChatInput";
import MessageArea from "./MessageArea";

const ChatArea = () => {
  return (
    <main className="bg-card relative flex flex-grow flex-col overflow-hidden">
      <div className="border-border flex items-center border-b px-4 py-2">
        <h1 className="text-foreground flex-1 text-lg font-semibold">
          Chat Assistant
        </h1>
      </div>
      <MessageArea />
      <div className="border-border bg-card sticky bottom-0 border-t px-4 py-3">
        <ChatInput />
      </div>
    </main>
  );
};

export default ChatArea;
