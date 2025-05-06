"use client";

import { usePlaygroundStore } from "@/store";
import { motion } from "framer-motion";
import { useQueryState } from "nuqs";

// Danh sách các ví dụ prompt
const EXAMPLE_PROMPTS = [
  {
    title: "Giải thích về Next.js App Router",
    prompt:
      "Giải thích về Next.js App Router và các lợi ích của nó so với Pages Router như thế nào?",
    icon: "🚀",
  },
  {
    title: "Hướng dẫn xây dựng API với Drizzle ORM",
    prompt:
      "Hướng dẫn cách xây dựng một API endpoint trong Next.js sử dụng Drizzle ORM để tương tác với cơ sở dữ liệu PostgreSQL.",
    icon: "🔧",
  },
  {
    title: "Quản lý state với Zustand và React Query",
    prompt:
      "Làm thế nào để quản lý client state với Zustand và server state với TanStack Query (React Query) trong một ứng dụng React hiệu quả?",
    icon: "⚡",
  },
  {
    title: "Thiết kế component với Tailwind và Shadcn UI",
    prompt:
      "Hướng dẫn tôi cách tùy biến component Button từ Shadcn/ui kết hợp với Tailwind CSS để tạo ra nhiều biến thể khác nhau.",
    icon: "🎨",
  },
];

const ExamplePromptItem = ({
  title,
  prompt,
  icon,
  onClick,
}: {
  title: string;
  prompt: string;
  icon: string;
  onClick: () => void;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card hover:bg-card/80 border-border flex w-full cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h3 className="text-foreground text-base font-medium">{title}</h3>
      </div>
      <p className="text-muted-foreground line-clamp-2 text-sm">{prompt}</p>
    </motion.div>
  );
};

const ExamplePrompts = () => {
  const { setInputMessage, chatInputRef } = usePlaygroundStore();
  const [selectedAgent] = useQueryState("agent");
  const handleSelectPrompt = (prompt: string) => {
    setInputMessage(prompt);

    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }, 0);
  };

  return (
    <section className="flex flex-col items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <h2 className="text-foreground mb-6 text-center text-xl font-medium">
          {selectedAgent
            ? "Bắt đầu với một vài ví dụ"
            : "Chọn một Agent để bắt đầu chat"}
        </h2>

        {selectedAgent ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {EXAMPLE_PROMPTS.map((item) => (
              <ExamplePromptItem
                key={item.title}
                title={item.title}
                prompt={item.prompt}
                icon={item.icon}
                onClick={() => handleSelectPrompt(item.prompt)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-muted-foreground">
              Vui lòng chọn một Agent từ setting bên trên để bắt đầu cuộc trò
              chuyện
            </p>
            <motion.div
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              className="text-4xl"
            >
              👆
            </motion.div>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ExamplePrompts;
