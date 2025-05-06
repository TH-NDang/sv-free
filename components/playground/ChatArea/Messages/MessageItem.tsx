import Icon from "@/components/ui/icon";
import MarkdownRenderer from "@/components/ui/typography/MarkdownRenderer";
import { usePlaygroundStore } from "@/store";
import type { PlaygroundChatMessage } from "@/types/playground";
import { memo } from "react";
import AgentThinkingLoader from "./AgentThinkingLoader";
import Audios from "./Multimedia/Audios";
import Images from "./Multimedia/Images";
import Videos from "./Multimedia/Videos";

interface MessageProps {
  message: PlaygroundChatMessage;
}

const AgentMessage = ({ message }: MessageProps) => {
  const { streamingErrorMessage } = usePlaygroundStore();
  let messageContent;
  if (message.streamingError) {
    messageContent = (
      <p className="text-destructive text-sm">
        Oops! Something went wrong while streaming.{" "}
        {streamingErrorMessage ? (
          <>{streamingErrorMessage}</>
        ) : (
          "Please try refreshing the page or try again later."
        )}
      </p>
    );
  } else if (message.content) {
    messageContent = (
      <div className="text-foreground flex w-full flex-col gap-4">
        <MarkdownRenderer>{message.content}</MarkdownRenderer>
        {message.videos && message.videos.length > 0 && (
          <Videos videos={message.videos} />
        )}
        {message.images && message.images.length > 0 && (
          <Images images={message.images} />
        )}
        {message.audio && message.audio.length > 0 && (
          <Audios audio={message.audio} />
        )}
      </div>
    );
  } else if (message.response_audio) {
    if (!message.response_audio.transcript) {
      messageContent = (
        <div className="mt-2 flex items-start">
          <AgentThinkingLoader />
        </div>
      );
    } else {
      messageContent = (
        <div className="flex w-full flex-col gap-4">
          <MarkdownRenderer>
            {message.response_audio.transcript}
          </MarkdownRenderer>
          {message.response_audio.content && message.response_audio && (
            <Audios audio={[message.response_audio]} />
          )}
        </div>
      );
    }
  } else {
    messageContent = (
      <div className="mt-2">
        <AgentThinkingLoader />
      </div>
    );
  }
  return (
    <div className="flex flex-row items-start gap-4 py-2">
      <div className="flex-shrink-0">
        <div className="bg-muted text-accent-foreground flex h-8 w-8 items-center justify-center rounded-full">
          <Icon type="agent" size="sm" />
        </div>
      </div>
      {messageContent}
    </div>
  );
};

const UserMessage = memo(({ message }: MessageProps) => {
  return (
    <div className="flex items-start py-2 text-start max-md:break-words">
      <div className="flex flex-row gap-x-3">
        <div className="flex-shrink-0">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
            <Icon type="user" size="sm" />
          </div>
        </div>
        <div className="text-foreground rounded-lg py-1 text-base">
          {message.content}
        </div>
      </div>
    </div>
  );
});

AgentMessage.displayName = "AgentMessage";
UserMessage.displayName = "UserMessage";
export { AgentMessage, UserMessage };
