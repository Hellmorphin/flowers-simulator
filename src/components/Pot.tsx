import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PotImg = styled(motion.img)`
  width: 220px;
  max-width: 60vw;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 8px 32px #6d4c41cc);
`;


const Pot: React.FC = () => {
  return (
    <PotImg
  src={new URL('../assets/gorshok.jpg', import.meta.url).href}
      alt="Горшок"
      animate={{
        scale: [1, 1.04, 1],
        rotate: [0, 2, -2, 0],
      }}
      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
    />
  );
};

export default Pot;
