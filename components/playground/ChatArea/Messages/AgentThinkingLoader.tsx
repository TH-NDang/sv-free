const AgentThinkingLoader = () => (
  <div className="flex items-center gap-2">
    <span className="text-muted-foreground text-sm">AI is thinking</span>
    <div className="flex items-center justify-center gap-1">
      <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s] [animation-duration:0.70s]" />
      <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s] [animation-duration:0.70s]" />
      <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-duration:0.70s]" />
    </div>
  </div>
);

export default AgentThinkingLoader;
