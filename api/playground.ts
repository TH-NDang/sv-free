import { toast } from "sonner";

import { proxyFetch } from "@/lib/proxyFetch";
import { APIRoutes } from "./routes";

import { Agent, ComboboxAgent, SessionEntry } from "@/types/playground";

export const getPlaygroundAgentsAPI = async (
  endpoint: string
): Promise<ComboboxAgent[]> => {
  const url = APIRoutes.GetPlaygroundAgents(endpoint);
  try {
    const response = await proxyFetch(url, { method: "GET" });

    if (!response.ok) {
      toast.error(`Failed to fetch playground agents: ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    // Transform the API response into the expected shape.
    const agents: ComboboxAgent[] = data.map((item: Agent) => ({
      value: item.agent_id || "",
      label: item.name || "",
      model: item.model || "",
      storage: item.storage || false,
    }));
    return agents;
  } catch {
    toast.error("Error fetching playground agents");
    return [];
  }
};

export const getPlaygroundStatusAPI = async (base: string): Promise<number> => {
  const url = APIRoutes.PlaygroundStatus(base);
  const response = await proxyFetch(url, { method: "GET" });

  return response.status;
};

export const getAllPlaygroundSessionsAPI = async (
  base: string,
  agentId: string
): Promise<SessionEntry[]> => {
  try {
    const url = APIRoutes.GetPlaygroundSessions(base, agentId);
    const response = await proxyFetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Return empty array when storage is not enabled
        return [];
      }
      throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }
    return response.json();
  } catch {
    return [];
  }
};

export const getPlaygroundSessionAPI = async (
  base: string,
  agentId: string,
  sessionId: string
) => {
  const url = APIRoutes.GetPlaygroundSession(base, agentId, sessionId);
  const response = await proxyFetch(url, {
    method: "GET",
  });

  return response.json();
};

export const deletePlaygroundSessionAPI = async (
  base: string,
  agentId: string,
  sessionId: string
) => {
  const url = APIRoutes.DeletePlaygroundSession(base, agentId, sessionId);
  const response = await proxyFetch(url, { method: "DELETE" });

  return response;
};
