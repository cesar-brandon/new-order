"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Maxx } from "@/components/pets";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAnswer } from "./actions";
import { useTheme } from "next-themes";
import { motion, useAnimation, useDragControls } from "framer-motion";
import RecentSales from "@/components/recent-sales";
import TransactionList from "@/components/transactions";
import { TrendingChart } from "@/components/trending";
import { Button } from "@/components/ui/button";

const recognition = new window.webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = "es-ES";

export default function Home() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [order, setOrder] = useState<string>("");
  const { setTheme } = useTheme();
  const [controls, setControls] = useState<any>({});

  const keyword = "Max";

  const audio = useMemo(() => new Audio("/audio/listening.mp3"), []);

  const handleStartRecording = useCallback(() => {
    recognition.start();
    setIsRecording(true);
    audio.play();

    recognition.onresult = (event) => {
      const order = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      setOrder(order);
    };
  }, [audio]);

  const moveToCenter = useCallback(
    (elementId: string) => {
      const container = document.getElementById("container");
      const element = document.getElementById(elementId);
      if (container && element) {
        const centerX = (container.offsetWidth - element.offsetWidth) / 2;
        const centerY = (container.offsetHeight - element.offsetHeight) / 2;
        setControls({
          x: centerX,
          y: centerY,
          transition: { duration: 0.3 },
          zIndex: 1,
        });
      }
    },
    [setControls],
  );

  const getOrder = useCallback(
    async (order: string) => {
      const { text } = await getAnswer(order).then((res) => {
        // setTheme(res.text.trim());
        moveToCenter(res.text.trim());
        console.log(res.text.trim());
        return res;
      });
      console.log(text);
    },
    [moveToCenter],
  );

  useEffect(() => {
    if (order) {
      getOrder(order);
    }
  }, [order, getOrder]);

  function handleStopRecording() {
    setIsRecording(false);
    recognition.stop();
  }

  const constraintsRef = useRef(null);

  return (
    <motion.main
      id="container"
      className="flex w-dvw h-full p-10"
      ref={constraintsRef}
    >
      <motion.div
        id="recent-sales"
        className="w-[30rem] h-[30rem]"
        drag
        animate={controls}
        dragConstraints={constraintsRef}
      >
        <RecentSales />
      </motion.div>
      <motion.div
        id="transactions"
        className="h-[30rem]"
        drag
        animate={controls}
        dragConstraints={constraintsRef}
      >
        <TransactionList />
      </motion.div>
      <motion.div
        id="trending"
        className="h-[30rem]"
        drag
        animate={controls}
        dragConstraints={constraintsRef}
      >
        <TrendingChart />
      </motion.div>
      <Maxx
        className={cn(
          "w-24 h-24 fixed -bottom-12 left-24 transition-all duration-300",
          isRecording && "-bottom-8",
        )}
      />
      <p>{order}</p>
      <ModeToggle className="fixed top-4 right-4" />
      <div
        className={cn(
          "fixed bottom-4 right-4 w-24 h-24 bg-foreground rounded-full flex items-center justify-center cursor-pointer",
          isRecording ? "bg-destructive" : "bg-primary",
        )}
        onClick={() =>
          isRecording ? handleStopRecording() : handleStartRecording()
        }
      />
      <div
        className={cn(
          "fixed hidden top-4 right-4 w-4 h-4 rounded-full bg-green-400",
          isRecording && "block",
        )}
      />
      <Button onClick={() => moveToCenter("recent-sales")}>Mover</Button>
    </motion.main>
  );
}
