"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useMotionStore } from "@/store/motion";
import RecentSales from "@/components/examples/recent-sales";
import TransactionList from "@/components/examples/transactions";
import ResumenCards from "@/components/examples/resumen-cards";
import TrendingChart from "@/components/examples/trending";
import { useRecognitionStore } from "@/store/recognition";
import { AudioSpectrum } from "@/components/AudioSpectrum";

export default function Home() {
  const { order, isRecording } = useRecognitionStore();

  const constraintsRef = useRef(null);
  const { setConstraintsRef } = useMotionStore();

  useEffect(() => {
    setConstraintsRef(constraintsRef.current);
  }, [setConstraintsRef]);

  return (
    <motion.main
      id="container"
      className="relative flex w-dvw h-full p-10 overflow-hidden flex-1 flex-col gap-4 md:gap-8"
      ref={constraintsRef}
    >
      <ResumenCards />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <RecentSales />
        <TransactionList />
        <TrendingChart />
      </div>
      <p>{order}</p>

      {isRecording && <AudioSpectrum className="absolute bottom-10 left-10" />}
    </motion.main>
  );
}
