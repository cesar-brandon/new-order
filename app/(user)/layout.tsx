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
import { Link } from "next-view-transitions";
import { HandIcon, PickaxeIcon } from "lucide-react";
import { usePathname } from "next/navigation";

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

  const pathname = usePathname();

  const { setTheme } = useTheme();

  const { elementIds } = useMotionStore();
  const { moveElementTo, resizeElementTo } = useElementActions();

  const audio = useMemo(() => new Audio("/audio/button-click.wav"), []);

  const handleStartRecording = useCallback(() => {
    recognition.start();
    setIsRecording(true);
    setIsRecordingStore(true);
    audio.pause();
    audio.currentTime = 0;
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
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }

  return (
    <div id="monitor" className="relative h-full">
      {children}
      {/* <Pet isRecording={isRecording} /> */}
      {/* <TestInstructions getOrder={getOrder} /> */}
      <div
        className="button2 fixed bottom-32 right-8 w-10 h-10 flex items-center justify-center
         rounded-full bg-primary cursor-pointer transition-all duration-300 z-10"
        onClick={() =>
          isRecording ? handleStopRecording() : handleStartRecording()
        }
      />
      <Link
        href={pathname === "/build" ? "/" : "/build"}
        onClick={() => {
          audio.pause();
          audio.currentTime = 0;
          audio.play();
        }}
      >
        <div
          className="button1 fixed bottom-8 right-8 w-24 h-24 flex items-center justify-center
          bg-primary rounded-full cursor-pointer transition-all duration-300 z-10"
        >
          <HandIcon className="svg1 stroke-accent-foreground/60 dark:stroke-accent/60" />
        </div>
      </Link>
    </div>
  );
}
