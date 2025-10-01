import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FlowerImg = styled(motion.img)`
  width: 120px;
  max-width: 40vw;
  margin-bottom: -40px;
  z-index: 3;
  user-select: none;
  pointer-events: none;
`;

type FlowerProps = {
  size: number; // px
  visible: boolean;
  marginBottom?: number;
};

const flowerVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1 },
};

const Flower: React.FC<FlowerProps> = ({ size, visible, marginBottom = -40 }) => {
  return (
    <FlowerImg
      src={new URL('../assets/Flow.jpg', import.meta.url).href}
      alt="Цветок"
      style={{ width: size, minWidth: size, maxWidth: '90vw', height: 'auto', marginBottom, transition: 'width 2s cubic-bezier(.4,2,.4,1)' }}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={flowerVariants}
      transition={{ duration: 2 }}
    />
  );
};

export default Flower;
