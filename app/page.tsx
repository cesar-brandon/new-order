"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Maxx } from "@/components/pets";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAnswer } from "./actions";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import RecentSales from "@/components/recent-sales";
import TransactionList from "@/components/transactions";
import { TrendingChart } from "@/components/trending";
import { Button } from "@/components/ui/button";
import ResumenCards from "@/components/resumen-cards";
import { useMotionStore } from "@/store/motion";
import { HandIcon, ScalingIcon, SpeechIcon } from "lucide-react";
import { OrderTypes } from "@/lib/types";
import { useElementActions } from "@/lib/hooks/use-element-actions";

const recognition = new window.webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = "es-ES";

export default function Home() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [order, setOrder] = useState<string>("");

  const { setTheme } = useTheme();

  const constraintsRef = useRef(null);
  const { setConstraintsRef, elementIds } = useMotionStore();
  const { moveElementTo, resizeElementTo } = useElementActions();

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

  const getOrder = useCallback(
    async (order: string) => {
      await getAnswer(order, elementIds)
        .then((res) => {
          if (res.object.action === OrderTypes.THEME) {
            setTheme(res.object.parameter.theme as string);
          }
          if (res.object.action === OrderTypes.MOVE) {
            moveElementTo({
              ...res.object.parameter,
              elementId: res.object.elementId as string,
            });
          }
          if (res.object.action === OrderTypes.RESIZE) {
            resizeElementTo({
              elementId: res.object.elementId as string,
              size: res.object.parameter.size as string,
            });
          }
          console.log(res.object);
        })
        .catch((err) => console.error(err));
    },
    [elementIds, moveElementTo, resizeElementTo, setTheme],
  );

  useEffect(() => {
    if (order) {
      getOrder(order);
    }
  }, [order, getOrder]);

  useEffect(() => {
    setConstraintsRef(constraintsRef.current);
  }, [setConstraintsRef]);

  function handleStopRecording() {
    setIsRecording(false);
    recognition.stop();
  }

  return (
    <motion.main
      id="container"
      className="flex w-dvw h-full p-10 pt-[4.4rem] overflow-hidden flex-1 flex-col gap-4 md:gap-8"
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
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
        <Button
          variant="outline"
          onClick={() => getOrder("quiero ver mas de cerca las transacciones")}
        >
          <SpeechIcon className="w-5 h-5" />
        </Button>
        <ModeToggle />
        <Button
          variant="outline"
          onClick={() =>
            moveElementTo({
              elementId: "recent-sales",
              direction: "up",
            })
          }
        >
          <HandIcon className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            resizeElementTo({
              elementId: "transactions",
              size: "xl",
            })
          }
        >
          <ScalingIcon className="w-5 h-5" />
        </Button>
      </div>
      <Maxx
        className={cn(
          "w-24 h-24 fixed -bottom-12 left-24 transition-all duration-300 z-10",
          isRecording && "-bottom-8",
        )}
      />
    </motion.main>
  );
}
