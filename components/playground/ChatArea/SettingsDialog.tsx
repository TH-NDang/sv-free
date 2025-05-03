"use client";

import { Bot, Cloud, Cog, History, RefreshCw, Save } from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";
import { toast } from "sonner";

import { AgentSelector } from "@/components/playground/Sidebar/AgentSelector";
import Sessions from "@/components/playground/Sidebar/Sessions/Sessions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import useChatActions from "@/hooks/useChatActions";
import { isValidUrl } from "@/lib/utils";
import { usePlaygroundStore } from "@/store";

const settingsNav = [
  { name: "Endpoint", icon: Cloud, content: "endpoint" },
  { name: "Agent", icon: Bot, content: "agent" },
  { name: "Sessions", icon: History, content: "sessions" },
];

export function SettingsDialog() {
  const [open, setOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState("endpoint");
  const {
    selectedEndpoint,
    isEndpointActive,
    setSelectedEndpoint,
    setAgents,
    setSessionsData,
    setMessages,
    selectedModel,
  } = usePlaygroundStore();
  const { initializePlayground } = useChatActions();
  const [endpointValue, setEndpointValue] = React.useState("");
  const [isRotating, setIsRotating] = React.useState(false);
  const [, setAgentId] = useQueryState("agent");
  const [, setSessionId] = useQueryState("session");

  React.useEffect(() => {
    setEndpointValue(selectedEndpoint || "");
  }, [selectedEndpoint, open]);

  const handleSaveEndpoint = async () => {
    if (!isValidUrl(endpointValue)) {
      toast.error("Please enter a valid URL");
      return;
    }

    const cleanEndpoint = endpointValue.replace(/\/$/, "").trim();
    setSelectedEndpoint(cleanEndpoint);
    setAgentId(null);
    setSessionId(null);
    setAgents([]);
    setSessionsData([]);
    setMessages([]);
    toast.success("Endpoint saved successfully");
  };

  const handleRefreshEndpoint = async () => {
    setIsRotating(true);
    await initializePlayground();
    setTimeout(() => setIsRotating(false), 500);
    toast.success("Endpoint refreshed");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Settings">
          <Cog className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Configure your chat assistant settings
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {settingsNav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={activeMenu === item.content}
                          onClick={() => setActiveMenu(item.content)}
                        >
                          <button>
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {settingsNav.find((item) => item.content === activeMenu)
                          ?.name || "Settings"}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col overflow-y-auto p-4 pt-0">
              {activeMenu === "agent" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium">Agent Configuration</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <Label htmlFor="agent-select">Select Agent</Label>
                      <div className="mt-2">
                        <AgentSelector />
                      </div>
                    </div>

                    {selectedModel && (
                      <div className="mt-4">
                        <Label>Current Model</Label>
                        <div className="bg-muted/40 text-muted-foreground mt-2 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                          {(() => {
                            const icon = selectedModel ? "agent" : undefined;
                            return icon ? <Icon type={icon} size="xs" /> : null;
                          })()}
                          {selectedModel || "No model selected"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeMenu === "endpoint" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium">
                    Endpoint Configuration
                  </h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <Label htmlFor="endpoint-url">Endpoint URL</Label>
                      <div className="mt-2 flex w-full items-center gap-2">
                        <Input
                          id="endpoint-url"
                          value={endpointValue}
                          onChange={(e) => setEndpointValue(e.target.value)}
                          placeholder="https://your-endpoint-url.com"
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleSaveEndpoint}
                          title="Save endpoint"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleRefreshEndpoint}
                          title="Refresh endpoint"
                        >
                          <div className={isRotating ? "animate-spin" : ""}>
                            <RefreshCw className="h-4 w-4" />
                          </div>
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <div className="text-sm">Status:</div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-2 w-2 rounded-full ${isEndpointActive ? "bg-positive" : "bg-destructive"}`}
                        />
                        <span className="text-sm">
                          {isEndpointActive ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeMenu === "sessions" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium">Sessions Management</h3>
                  <div className="rounded-md border p-4">
                    <Sessions />
                  </div>
                </div>
              )}

              {activeMenu === "chat" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium">Chat Settings</h3>
                  <div className="rounded-md border p-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="message-tone">Message Tone</Label>
                        <Select defaultValue="professional">
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">
                              Professional
                            </SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="concise">Concise</SelectItem>
                            <SelectItem value="detailed">Detailed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="code-style">Code Style</Label>
                        <Select defaultValue="default">
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select code style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="concise">Concise</SelectItem>
                            <SelectItem value="detailed">
                              Detailed with comments
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-complete">
                          Suggest auto-completions
                        </Label>
                        <Switch id="auto-complete" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
