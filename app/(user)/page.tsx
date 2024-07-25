"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useMotionStore } from "@/store/motion";
import RecentSales from "@/components/examples/recent-sales";
import TransactionList from "@/components/examples/transactions";
import ResumenCards from "@/components/examples/resumen-cards";
import TrendingChart from "@/components/examples/trending";
import { useRecognitionStore } from "@/store/recognition";

export default function Home() {
  const { order } = useRecognitionStore();

  const constraintsRef = useRef(null);
  const { setConstraintsRef } = useMotionStore();

  useEffect(() => {
    setConstraintsRef(constraintsRef.current);
  }, [setConstraintsRef]);

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
    </motion.main>
  );
}
