import type { PlaygroundChatMessage } from "@/types/playground";

import Icon from "@/components/ui/icon";
import Tooltip from "@/components/ui/tooltip/CustomTooltip";
import type {
  ReasoningProps,
  ReasoningStepProps,
  Reference,
  ReferenceData,
  ToolCallProps,
} from "@/types/playground";
import { memo, type FC } from "react";
import ChatBlankState from "./ChatBlankState";
import { AgentMessage, UserMessage } from "./MessageItem";

interface MessageListProps {
  messages: PlaygroundChatMessage[];
}

interface MessageWrapperProps {
  message: PlaygroundChatMessage;
  isLastMessage: boolean;
}

interface ReferenceProps {
  references: ReferenceData[];
}

interface ReferenceItemProps {
  reference: Reference;
}

const ReferenceItem: FC<ReferenceItemProps> = ({ reference }) => (
  <div className="bg-muted/40 hover:bg-muted/70 relative flex h-16 w-[190px] cursor-default flex-col justify-between overflow-hidden rounded-md p-3 transition-colors">
    <p className="text-foreground text-sm font-medium">{reference.name}</p>
    <p className="text-muted-foreground truncate text-xs">
      {reference.content}
    </p>
  </div>
);

const References: FC<ReferenceProps> = ({ references }) => (
  <div className="flex flex-col gap-4">
    {references.map((referenceData, index) => (
      <div
        key={`${referenceData.query}-${index}`}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-wrap gap-3">
          {referenceData.references.map((reference, refIndex) => (
            <ReferenceItem
              key={`${reference.name}-${reference.meta_data.chunk}-${refIndex}`}
              reference={reference}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const AgentMessageWrapper = ({ message }: MessageWrapperProps) => {
  return (
    <div className="flex flex-col gap-y-9">
      {message.extra_data?.reasoning_steps &&
        message.extra_data.reasoning_steps.length > 0 && (
          <div className="flex items-start gap-4">
            <Tooltip
              delayDuration={0}
              content={<p className="text-accent">Reasoning</p>}
              side="top"
            >
              <Icon type="reasoning" size="sm" />
            </Tooltip>
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase">Reasoning</p>
              <Reasonings reasoning={message.extra_data.reasoning_steps} />
            </div>
          </div>
        )}
      {message.extra_data?.references &&
        message.extra_data.references.length > 0 && (
          <div className="flex items-start gap-4">
            <Tooltip
              delayDuration={0}
              content={<p className="text-accent">References</p>}
              side="top"
            >
              <Icon type="references" size="sm" />
            </Tooltip>
            <div className="flex flex-col gap-3">
              <References references={message.extra_data.references} />
            </div>
          </div>
        )}
      {message.tool_calls && message.tool_calls.length > 0 && (
        <div className="flex items-center gap-3">
          {" "}
          <Tooltip
            delayDuration={0}
            content={<p className="text-accent-foreground">Tool Calls</p>}
            side="top"
          >
            <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-md">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground"
              >
                <path
                  d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Tooltip>
          <div className="flex flex-wrap gap-2">
            {message.tool_calls.map((toolCall, index) => (
              <ToolComponent
                key={
                  toolCall.tool_call_id ||
                  `${toolCall.tool_name}-${toolCall.created_at}-${index}`
                }
                tools={toolCall}
              />
            ))}
          </div>
        </div>
      )}
      <AgentMessage message={message} />
    </div>
  );
};
const Reasoning: FC<ReasoningStepProps> = ({ index, stepTitle }) => (
  <div className="text-foreground flex items-center gap-2">
    <div className="bg-muted flex h-5 items-center rounded-md px-2">
      <p className="text-xs font-medium">Step {index + 1}</p>
    </div>
    <p className="text-sm">{stepTitle}</p>
  </div>
);
const Reasonings: FC<ReasoningProps> = ({ reasoning }) => (
  <div className="flex flex-col items-start justify-center gap-2">
    {reasoning.map((title, index) => (
      <Reasoning
        key={`${title.title}-${title.action}-${index}`}
        stepTitle={title.title}
        index={index}
      />
    ))}
  </div>
);

const ToolComponent = memo(({ tools }: ToolCallProps) => (
  <div className="bg-muted text-foreground cursor-default rounded-full px-2 py-1.5 text-xs">
    <p className="font-medium uppercase">{tools.tool_name}</p>
  </div>
));
ToolComponent.displayName = "ToolComponent";
const Messages = ({ messages }: MessageListProps) => {
  if (messages.length === 0) {
    return <ChatBlankState />;
  }

  return (
    <>
      {messages.map((message, index) => {
        const key = `${message.role}-${message.created_at}-${index}`;
        const isLastMessage = index === messages.length - 1;

        if (message.role === "agent") {
          return (
            <AgentMessageWrapper
              key={key}
              message={message}
              isLastMessage={isLastMessage}
            />
          );
        }
        return <UserMessage key={key} message={message} />;
      })}
    </>
  );
};

export default Messages;
