import { usePlaygroundStore } from "@/store";
import Link from "next/link";
import { useQueryState } from "nuqs";

const SessionBlankState = () => {
  const { selectedEndpoint, isEndpointActive, hasStorage } =
    usePlaygroundStore();
  const [agentId] = useQueryState("agent");

  const errorMessage = (() => {
    switch (true) {
      case !isEndpointActive:
        return "Endpoint is not connected. Please connect the endpoint to see the history.";
      case !selectedEndpoint:
        return "Select an endpoint to see the history.";
      case !agentId:
        return "Select an agent to see the history.";
      case !hasStorage:
        return (
          <>
            Connect{" "}
            <Link
              className="underline"
              href={"https://docs.agno.com/storage"}
              target="_blank"
            >
              storage
            </Link>{" "}
            to your agent to see sessions.{" "}
          </>
        );
      default:
        return "No session records yet. Start a conversation to create one.";
    }
  })();
  return (
    <div className="bg-muted/30 mt-1 flex items-center justify-center rounded-md px-4 py-6">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-background rounded-full p-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted-foreground"
          >
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-foreground text-sm font-medium">
            No sessions found
          </h3>
          <p className="text-muted-foreground max-w-[210px] text-center text-xs">
            {errorMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionBlankState;
