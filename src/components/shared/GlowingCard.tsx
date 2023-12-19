import React, { useRef } from "react";

type GlowingCardProps = {
  children: React.ReactNode;
  className?: string;
  size?: "extra-large" | "large" | "medium" | "small";
};

const GlowingCard = ({
  children,
  className,
  size = "large",
}: GlowingCardProps) => {
  const card = useRef<HTMLDivElement>(null!);

  let classes = `before:w-[${size}px] before:h-[${size}px]`;

  switch (size) {
    case "extra-large":
      classes = "before:w-[1600px] before:h-[1600px]";
      break;
    case "large":
      classes = "before:w-[1250px] before:h-[1250px]";
      break;
    case "medium":
      classes = "before:w-[800px] before:h-[800px]";
      break;
    case "small":
      classes = "before:w-[500px] before:h-[500px]";
      break;
  }

  function mouseEffectHandler(e: React.MouseEvent) {
    const x = e.pageX - card.current.offsetLeft;
    const y = e.pageY - card.current.offsetTop;

    card.current.style.setProperty("--x", x + "px");
    card.current.style.setProperty("--y", y + "px");
  }

  return (
    <div
      ref={card}
      onMouseMove={mouseEffectHandler}
      className={`glowing-card ${classes} ${className ? " " + className : ""}`}
    >
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default GlowingCard;
