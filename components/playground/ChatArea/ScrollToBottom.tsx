"use client";

import type React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useStickToBottomContext } from "use-stick-to-bottom";

import { Button } from "@/components/ui/button";

const ScrollToBottom: React.FC = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    <AnimatePresence>
      {!isAtBottom && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          {" "}
          <Button
            onClick={() => scrollToBottom()}
            type="button"
            size="icon"
            variant="secondary"
            className="bg-background text-foreground hover:bg-muted border shadow-md transition-all duration-200"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M12 5v14m0 0l-6-6m6 6l6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToBottom;
