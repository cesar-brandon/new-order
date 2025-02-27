"use client";

import {
  HomeIcon,
  PickaxeIcon,
  GamepadIcon,
  Gamepad2Icon,
  BadgeHelpIcon,
  HandIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import NavBarItem from "./navbar-item";

export function NavBar() {
  const items = [
    {
      content: "Mover",
      href: "/",
      icon: <HandIcon />,
    },
    {
      content: "Construir",
      href: "/build",
      icon: <PickaxeIcon />,
    },
  ];
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      prevScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`z-10 p-3 fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 bg-background/30 backdrop-blur
                  rounded-full flex items-center justify-center gap-8 shadow-md
                  border transition-all duration-300 ${
                    isHidden ? "translate-y-24" : "translate-y-0"
                  }`}
    >
      {items.map((item) => (
        <NavBarItem key={item.content} {...item} />
      ))}
    </div>
  );
}
