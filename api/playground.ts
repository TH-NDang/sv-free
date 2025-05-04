import { toast } from "sonner";

import { proxyFetch } from "@/lib/proxyFetch";
import { APIRoutes } from "./routes";

import { Agent, ComboboxAgent, SessionEntry } from "@/types/playground";

export const getPlaygroundAgentsAPI = async (
  endpoint: string
): Promise<ComboboxAgent[]> => {
  const url = APIRoutes.GetPlaygroundAgents(endpoint);
  try {
    // Check if the URL is from a different origin (requires proxy)
    const isExternalUrl =
      !url.startsWith("/") && !url.startsWith(window.location.origin);

    let data;
    if (isExternalUrl) {
      const proxyResponse = await proxyFetch<Agent[]>(url, { method: "GET" });

      if (proxyResponse.status !== 200) {
        toast.error(
          `Failed to fetch playground agents: ${proxyResponse.statusText}`
        );
        return [];
      }

      data = proxyResponse.data;
    } else {
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        toast.error(
          `Failed to fetch playground agents: ${response.statusText}`
        );
        return [];
      }

      data = await response.json();
    }

    const agents: ComboboxAgent[] = data.map((item: Agent) => ({
      value: item.agent_id || "",
      label: item.name || "",
      model: item.model || "",
      storage: item.storage || false,
    }));
    return agents;
  } catch (error) {
    console.error("Error fetching playground agents:", error);
    toast.error("Error fetching playground agents");
    return [];
  }
};

export const getPlaygroundStatusAPI = async (base: string): Promise<number> => {
  const url = APIRoutes.PlaygroundStatus(base);
  const isExternalUrl =
    !url.startsWith("/") && !url.startsWith(window.location.origin);

  if (isExternalUrl) {
    try {
      const proxyResponse = await proxyFetch(url, { method: "GET" });
      return proxyResponse.status;
    } catch (error) {
      console.error("Error checking playground status:", error);
      return 500;
    }
  } else {
    const response = await fetch(url, {
      method: "GET",
    });
    return response.status;
  }
};

export const getAllPlaygroundSessionsAPI = async (
  base: string,
  agentId: string
): Promise<SessionEntry[]> => {
  try {
    const url = APIRoutes.GetPlaygroundSessions(base, agentId);
    const isExternalUrl =
      !url.startsWith("/") && !url.startsWith(window.location.origin);

    if (isExternalUrl) {
      const proxyResponse = await proxyFetch<SessionEntry[]>(url, {
        method: "GET",
      });

      if (proxyResponse.status === 404) {
        return [];
      }

      if (proxyResponse.status !== 200) {
        throw new Error(
          `Failed to fetch sessions: ${proxyResponse.statusText}`
        );
      }

      return proxyResponse.data;
    } else {
      const response = await fetch(url, {
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
    }
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
  const isExternalUrl =
    !url.startsWith("/") && !url.startsWith(window.location.origin);
  if (isExternalUrl) {
    const proxyResponse = await proxyFetch<Record<string, unknown>>(url, {
      method: "GET",
    });
    return proxyResponse.data;
  } else {
    const response = await fetch(url, {
      method: "GET",
    });
    return response.json();
  }
};

export const deletePlaygroundSessionAPI = async (
  base: string,
  agentId: string,
  sessionId: string
) => {
  const url = APIRoutes.DeletePlaygroundSession(base, agentId, sessionId);
  const isExternalUrl =
    !url.startsWith("/") && !url.startsWith(window.location.origin);

  if (isExternalUrl) {
    const proxyResponse = await proxyFetch(url, { method: "DELETE" });
    return proxyResponse;
  } else {
    const response = await fetch(url, {
      method: "DELETE",
    });
    return response;
  }
};
