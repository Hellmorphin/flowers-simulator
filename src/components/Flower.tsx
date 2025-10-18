import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const FlowerImg = styled(motion.img)`
  width: 120px;
  max-width: 40vw;
  margin-bottom: -50px;
  z-index: 20;
  position: relative;
  user-select: none;
  pointer-events: none;
  transform-origin: bottom center;
`;

type FlowerProps = {
  size: number; // px
  visible: boolean;
  marginBottom?: number;
  skin?: string;
};

const Flower: React.FC<FlowerProps> = ({
  size,
  visible,
  marginBottom = -40,
  skin,
}) => {
  return (
    <FlowerImg
      src={
        new URL(`../assets/${skin ? skin : "Flowers1.png"}`, import.meta.url)
          .href
      }
      alt="Цветок"
      style={{
  width: size,
  minWidth: size,
  maxWidth: "90vw",
  height: "auto",
  marginBottom,
  transition: "width 2s cubic-bezier(.4,2,.4,1)",
        opacity: visible ? 1 : 0,
      }}
      animate={visible ? { rotate: [-7, 7, -7] } : { rotate: 0 }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  );
};

export default Flower;
