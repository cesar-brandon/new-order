import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const AudioSpectrum = ({ className }: { className?: string }) => {
  const container = {
    up: { height: "28px" },
    down: { height: "4px" },
  };

  const renderMotionSpan = (delay: number) => (
    <motion.span
      variants={container}
      initial="down"
      animate="up"
      transition={{
        delay: delay,
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="w-2 h-5 bg-primary rounded-sm"
    />
  );

  const elements = [0, 0.3, 0.45, 0, 0.3, 0.45];

  return (
    <div className={cn("relative flex items-center gap-2 mx-auto", className)}>
      {elements.map((element, index) => (
        <React.Fragment key={index}>{renderMotionSpan(element)}</React.Fragment>
      ))}
    </div>
  );
};
