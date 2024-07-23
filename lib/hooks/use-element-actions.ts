import { useMotionStore } from "@/store/motion";

//NOTE: Mejorar la funcionalidad de mover

export function useElementActions() {
  const { controls } = useMotionStore();

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
    const control = controls[elementId];
    const container = document.getElementById("container");
    const element = document.getElementById(elementId);
    if (container && element) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      let X =
        elementRect.left + (x !== undefined ? x * containerRect.width : 0);
      let Y =
        elementRect.top + (y !== undefined ? y * containerRect.height : 0);

      if (direction === "center") {
        X = (containerRect.width - elementRect.width) / 2;
        Y = (containerRect.height - elementRect.height) / 2;
      }
      if (direction === "up") {
        Y -= containerRect.height;
      }
      if (direction === "down") Y += containerRect.height;
      if (direction === "left") X -= containerRect.width;
      if (direction === "right") X += containerRect.width;
      if (direction === "up-left") {
        X -= containerRect.width;
        Y -= containerRect.height;
      }
      if (direction === "up-right") {
        X += containerRect.width;
        Y -= containerRect.height;
      }
      if (direction === "down-left") {
        X -= containerRect.width;
        Y += containerRect.height;
      }
      if (direction === "down-right") {
        X += containerRect.width;
        Y += containerRect.height;
      }

      X = Math.max(0, Math.min(X, containerRect.width - elementRect.width));
      Y = Math.max(0, Math.min(Y, containerRect.height - elementRect.height));

      if (control) {
        control.start({
          x: X,
          y: Y,
          transition: { duration: 0.3 },
          zIndex: 1,
        });
      }
    }
  };

  const resizeElementTo = ({
    elementId,
    size,
  }: {
    elementId: string;
    size: string;
  }) => {
    const control = controls[elementId];
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

      if (control) {
        control.start({
          scale,
          transition: { duration: 0.3 },
          zIndex: 1,
        });
      }
    }
  };

  return { moveElementTo, resizeElementTo };
}
