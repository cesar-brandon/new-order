"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { streamComponent } from "./actions";
import { useRecognitionStore } from "@/store/recognition";

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();
  const { order } = useRecognitionStore();

  return (
    <main className="flex flex-col items-center justify-center h-full gap-4">
      {order}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setComponent(await streamComponent("Muestra el tiempo en Perú"));
        }}
      >
        <Button>Mostrar Componente</Button>
      </form>
      <div>{component}</div>
    </main>
  );
}
