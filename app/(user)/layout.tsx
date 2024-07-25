"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../globals.css";
import { useTheme } from "next-themes";
import { useMotionStore } from "@/store/motion";
import { useElementActions } from "@/lib/hooks/use-element-actions";
import { getAnswer } from "../actions";
import { OrderTypes } from "@/config";
import { Pet } from "@/components/pet";
import { TestInstructions } from "@/components/test-instructions";
import { cn } from "@/lib/utils";
import { useRecognitionStore } from "@/store/recognition";

const recognition = new window.webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = "es-ES";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [order, setOrder] = useState<string>("");
  const { setIsRecording: setIsRecordingStore, setOrder: setOrderStore } =
    useRecognitionStore();

  const { setTheme } = useTheme();

  const { elementIds } = useMotionStore();
  const { moveElementTo, resizeElementTo } = useElementActions();

  const audio = useMemo(() => new Audio("/audio/listening.mp3"), []);

  const handleStartRecording = useCallback(() => {
    recognition.start();
    setIsRecording(true);
    setIsRecordingStore(true);
    audio.play();

    recognition.onresult = (event) => {
      const order = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      setOrder(order);
      setOrderStore(order);
    };
  }, [audio, setOrderStore, setIsRecordingStore]);

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

  function handleStopRecording() {
    setIsRecording(false);
    setIsRecordingStore(false);
    recognition.stop();
  }

  return (
    <>
      {children}
      <Pet isRecording={isRecording} />
      <TestInstructions getOrder={getOrder} />
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
    </>
  );
}
