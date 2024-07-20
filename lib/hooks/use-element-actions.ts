import { useMotionStore } from "@/store/motion";

export function useElementActions() {
  const { moveElement, resizeElement } = useMotionStore();

  const moveElementTo = ({
    elementId,
    x,
    y,
    direction,
  }: {
    elementId: string;
    x?: number;
    y?: number;
    direction?: string;
  }) => {
    const container = document.getElementById("container");
    const element = document.getElementById(elementId);
    if (container && element) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      console.log("container", containerRect, "elemento", elementRect);
      let X =
        elementRect.left + (x !== undefined ? x * containerRect.width : 0);
      let Y =
        elementRect.top + (y !== undefined ? y * containerRect.height : 0);

      if (direction === "center") {
        X = (containerRect.width - elementRect.width) / 2;
        Y = (containerRect.height - elementRect.height) / 2;
      }
      if (direction === "up") Y -= elementRect.height;
      if (direction === "down") Y += elementRect.height;
      if (direction === "left") X -= elementRect.width;
      if (direction === "right") X += elementRect.width;
      if (direction === "up-left") {
        X -= elementRect.width;
        Y -= elementRect.height;
      }
      if (direction === "up-right") {
        X += elementRect.width;
        Y -= elementRect.height;
      }
      if (direction === "down-left") {
        X -= elementRect.width;
        Y += elementRect.height;
      }
      if (direction === "down-right") {
        X += elementRect.width;
        Y += elementRect.height;
      }

      X = Math.max(0, Math.min(X, containerRect.width - elementRect.width));
      Y = Math.max(0, Math.min(Y, containerRect.height - elementRect.height));

      moveElement(elementId, X, Y);
    }
  };

  const resizeElementTo = ({
    elementId,
    size,
  }: {
    elementId: string;
    size: string;
  }) => {
    const element = document.getElementById(elementId);
    if (element) {
      const scale = (() => {
        switch (size) {
          case "sm":
            return 0.5;
          case "md":
            return 0.75;
          case "lg":
            return 1.25;
          case "xl":
            return 1.5;
          default:
            return 1;
        }
      })();

      resizeElement(elementId, scale);
    }
  };

  return { moveElementTo, resizeElementTo };
}
