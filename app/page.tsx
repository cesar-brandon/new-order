"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Maxx } from "@/components/pets";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const recognition = new window.webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = "es-ES";

export default function Home() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [buffer, setBuffer] = useState<string>("");
  const keyword = "Max";

  const audio = useMemo(() => new Audio("/audio/listening.mp3"), []);

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    audio.play();
  }, [audio]);

  useEffect(() => {
    recognition.onresult = (event) => {
      console.log("executed");
      const buffer = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      setBuffer(buffer);
      if (buffer.includes(keyword)) {
        handleStartRecording();
      }
    };

    recognition.onend = () => {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  }, [handleStartRecording]);

  function handleStopRecording() {
    setIsRecording(false);
    recognition.stop();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Maxx
        className={cn(
          "w-24 h-24 fixed -bottom-12 left-24 transition-all duration-300",
          isRecording && "-bottom-8",
        )}
      />
      <p>{buffer}</p>
      <ModeToggle />
      <div
        className={cn(
          "w-24 h-24 bg-foreground rounded-full flex items-center justify-center cursor-pointer",
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
    </main>
  );
}
