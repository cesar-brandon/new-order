"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Maxx } from "@/components/pets";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAnswer } from "./actions";
import { useTheme } from "next-themes";
import {
  motion,
  useAnimate,
  useAnimation,
  useAnimationControls,
  useDragControls,
} from "framer-motion";
import RecentSales from "@/components/recent-sales";
import TransactionList from "@/components/transactions";
import { TrendingChart } from "@/components/trending";
import { Button } from "@/components/ui/button";
import ResumenCards from "@/components/resumen-cards";
import { useMotionStore } from "@/store/motion";

const recognition = new window.webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = "es-ES";

export default function Home() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [order, setOrder] = useState<string>("");

  const { setTheme } = useTheme();

  const constraintsRef = useRef(null);
  //NOTE: quitar el estado de controls si no es nesesario
  const { setConstraintsRef, setScope, setControls } = useMotionStore();
  // const controls = useAnimationControls();
  const [scope, animate] = useAnimate();

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
    async (elementId: string) => {
      const container = document.getElementById("container");
      const element = document.getElementById(elementId);
      if (container && element) {
        const centerX = (container.offsetWidth - element.offsetWidth) / 2;
        const centerY = (container.offsetHeight - element.offsetHeight) / 2;
        await animate(scope.current, {
          x: centerX,
          y: centerY,
          transition: { duration: 0.3 },
          zIndex: 1,
        });
      }
    },
    [animate, scope],
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

  useEffect(() => {
    setConstraintsRef(constraintsRef.current);
    setScope(scope);
  }, [setConstraintsRef, setScope, scope]);

  function handleStopRecording() {
    setIsRecording(false);
    recognition.stop();
  }

  return (
    <motion.main
      id="container"
      className="flex w-dvw h-full p-10 pt-16 overflow-hidden flex-1 flex-col gap-4 md:gap-8"
      ref={constraintsRef}
    >
      <ResumenCards />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <RecentSales />
        <TransactionList />
        <TrendingChart />
      </div>
      <p>{order}</p>
      <div
        className={cn(
          "fixed bottom-4 right-4 w-24 h-24 bg-foreground rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-10",
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
      <ModeToggle className="fixed top-4 left-1/2 transform -translate-x-1/2" />
      <Button
        className="fixed top-4 right-4"
        onClick={() => moveToCenter("recent-sales")}
      >
        Mover
      </Button>
      <Maxx
        className={cn(
          "w-24 h-24 fixed -bottom-12 left-24 transition-all duration-300",
          isRecording && "-bottom-8",
        )}
      />
    </motion.main>
  );
}
