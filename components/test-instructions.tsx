import { HandIcon, ScalingIcon, SpeechIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useElementActions } from "@/lib/hooks/use-element-actions";

export function TestInstructions({
  getOrder,
}: {
  getOrder: (order: string) => void;
}) {
  const { moveElementTo, resizeElementTo } = useElementActions();
  return (
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
            elementId: "transactions",
            // direction: "left",
            x: -100,
            y: -100,
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
  );
}
