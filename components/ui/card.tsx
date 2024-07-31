import * as React from "react";

import { cn } from "@/lib/utils";
import { motion, useAnimationControls } from "framer-motion";
import { useMotionStore } from "@/store/motion";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    addControl,
    controls,
    constraintsRef,
    setElementId,
    currentElementId,
    setCurrentElementId,
  } = useMotionStore();
  const animateControls = useAnimationControls();

  React.useEffect(() => {
    if (props.id) {
      addControl(props.id, animateControls);
      setElementId(props.id);
    }
  }, [addControl, animateControls, props.id, setElementId]);

  const cardControls = props.id ? controls[props.id] : undefined;
  const zIndex = currentElementId === props.id ? 1 : 0;

  return (
    <motion.div
      id={props.id}
      drag
      onDragStart={() => {
        animateControls.start({ scale: 1.1 });
        setCurrentElementId(props.id as string);
      }}
      onDragEnd={() => animateControls.start({ scale: 1 })}
      dragConstraints={constraintsRef}
      animate={cardControls}
      style={{ zIndex }}
    >
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-primary bg-card/30 backdrop-blur-md text-primary shadow-sm",
          className,
        )}
        {...props}
      />
    </motion.div>
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
