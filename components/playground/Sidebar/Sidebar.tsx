"use client";
import { AgentSelector } from "@/components/playground/Sidebar/AgentSelector";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import useChatActions from "@/hooks/useChatActions";
import { getProviderIcon } from "@/lib/modelProvider";
import { isValidUrl, truncateText } from "@/lib/utils";
import { usePlaygroundStore } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Sessions from "./Sessions";
const ENDPOINT_PLACEHOLDER = "No endpoint added";
const SidebarHeader = () => (
  <div className="flex items-center gap-2 px-3 py-2">
    <Icon type="agno" size="sm" />
    <span className="text-foreground text-sm font-semibold">Agent UI</span>
  </div>
);

const NewChatButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span>New Chat</span>
  </Button>
);

const ModelDisplay = ({ model }: { model: string }) => (
  <div className="border-border bg-muted/40 text-muted-foreground flex h-9 w-full items-center gap-2 rounded-md border px-3 py-2 text-sm">
    {(() => {
      const icon = getProviderIcon(model);
      return icon ? <Icon type={icon} className="shrink-0" size="xs" /> : null;
    })()}
    {model}
  </div>
);

const Endpoint = () => {
  const {
    selectedEndpoint,
    isEndpointActive,
    setSelectedEndpoint,
    setAgents,
    setSessionsData,
    setMessages,
  } = usePlaygroundStore();
  const { initializePlayground } = useChatActions();
  const [isEditing, setIsEditing] = useState(false);
  const [endpointValue, setEndpointValue] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [, setAgentId] = useQueryState("agent");
  const [, setSessionId] = useQueryState("session");

  useEffect(() => {
    setEndpointValue(selectedEndpoint);
    setIsMounted(true);
  }, [selectedEndpoint]);

  const getStatusColor = (isActive: boolean) =>
    isActive ? "bg-positive" : "bg-destructive";

  const handleSave = async () => {
    if (!isValidUrl(endpointValue)) {
      toast.error("Please enter a valid URL");
      return;
    }
    const cleanEndpoint = endpointValue.replace(/\/$/, "").trim();
    setSelectedEndpoint(cleanEndpoint);
    setAgentId(null);
    setSessionId(null);
    setIsEditing(false);
    setIsHovering(false);
    setAgents([]);
    setSessionsData([]);
    setMessages([]);
  };

  const handleCancel = () => {
    setEndpointValue(selectedEndpoint);
    setIsEditing(false);
    setIsHovering(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleRefresh = async () => {
    setIsRotating(true);
    await initializePlayground();
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="text-foreground text-xs font-medium uppercase">
        Endpoint
      </div>
      {isEditing ? (
        <div className="flex w-full items-center gap-1">
          {" "}
          <input
            type="text"
            value={endpointValue}
            onChange={(e) => setEndpointValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-border bg-background text-foreground focus-visible:ring-ring h-9 w-full rounded-md border p-3 text-sm focus-visible:outline-none focus-visible:ring-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="hover:cursor-pointer hover:bg-transparent"
          >
            <Icon type="save" size="xs" />
          </Button>
        </div>
      ) : (
        <div className="flex w-full items-center gap-1">
          {" "}
          <motion.div
            className="border-border bg-muted relative flex h-9 w-full cursor-pointer items-center justify-between rounded-md border p-3 uppercase"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => setIsEditing(true)}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <AnimatePresence mode="wait">
              {isHovering ? (
                <motion.div
                  key="endpoint-display-hover"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {" "}
                  <p className="text-foreground flex items-center gap-2 whitespace-nowrap text-sm font-medium">
                    <Icon type="edit" size="xxs" /> EDIT ENDPOINT
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="endpoint-display"
                  className="absolute inset-0 flex items-center justify-between px-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {" "}
                  <p className="text-foreground text-sm">
                    {isMounted
                      ? truncateText(selectedEndpoint, 21) ||
                        ENDPOINT_PLACEHOLDER
                      : "http://localhost:7777"}
                  </p>
                  <div
                    className={`size-2 shrink-0 rounded-full ${getStatusColor(isEndpointActive)}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="hover:cursor-pointer hover:bg-transparent"
          >
            <motion.div
              key={isRotating ? "rotating" : "idle"}
              animate={{ rotate: isRotating ? 360 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Icon type="refresh" size="xs" />
            </motion.div>
          </Button>
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { clearChat, focusChatInput, initializePlayground } = useChatActions();
  const {
    messages,
    selectedEndpoint,
    isEndpointActive,
    selectedModel,
    hydrated,
    isEndpointLoading,
  } = usePlaygroundStore();
  const [isMounted, setIsMounted] = useState(false);
  const [agentId] = useQueryState("agent");
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setIsMounted(true);
    if (hydrated) initializePlayground();
  }, [selectedEndpoint, initializePlayground, hydrated]);
  const handleNewChat = () => {
    clearChat();
    focusChatInput();
  };
  return (
    <motion.aside
      className="bg-background relative flex h-screen shrink-0 grow-0 flex-col overflow-hidden px-2 py-3"
      initial={{ width: "16rem" }}
      animate={{ width: isCollapsed ? "2.5rem" : "16rem" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-2 top-2 z-10 p-1"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        type="button"
        whileTap={{ scale: 0.95 }}
      >
        <Icon
          type="sheet"
          size="xs"
          className={`transform ${isCollapsed ? "rotate-180" : "rotate-0"}`}
        />
      </motion.button>
      <motion.div
        className="w-60 space-y-5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          pointerEvents: isCollapsed ? "none" : "auto",
        }}
      >
        <SidebarHeader />
        <NewChatButton
          disabled={messages.length === 0}
          onClick={handleNewChat}
        />
        {isMounted && (
          <>
            <Endpoint />
            {isEndpointActive && (
              <>
                <motion.div
                  className="flex w-full flex-col items-start gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {" "}
                  <div className="text-foreground text-xs font-medium uppercase">
                    Agent
                  </div>
                  {isEndpointLoading ? (
                    <div className="flex w-full flex-col gap-2">
                      {["agent-skeleton", "model-skeleton"].map((id) => (
                        <Skeleton key={id} className="h-9 w-full rounded-md" />
                      ))}
                    </div>
                  ) : (
                    <>
                      <AgentSelector />
                      {selectedModel && agentId && (
                        <ModelDisplay model={selectedModel} />
                      )}
                    </>
                  )}
                </motion.div>
                <Sessions />
              </>
            )}
          </>
        )}
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
