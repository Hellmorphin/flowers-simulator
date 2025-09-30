import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Arrow = styled(motion.div)<{top?:string, right?:string, left?:string, bottom?:string}>`
  position: fixed;
  z-index: 200;
  font-size: 2.5rem;
  color: #ffb300;
  filter: drop-shadow(0 2px 8px #6d4c41cc);
  pointer-events: none;
  top: ${({top})=>top||'auto'};
  right: ${({right})=>right||'auto'};
  left: ${({left})=>left||'auto'};
  bottom: ${({bottom})=>bottom||'auto'};
`;

const TutorialBox = styled(motion.div)<{top?:string, right?:string, left?:string, bottom?:string}>`
  position: fixed;
  background: rgba(255, 236, 179, 0.95);
  color: #6d4c41;
  border-radius: 1.2rem;
  padding: 1.2rem 2rem;
  box-shadow: 0 2px 16px #a1887f44;
  z-index: 201;
  font-size: 1.1rem;
  max-width: 260px;
  top: ${({top})=>top||'auto'};
  right: ${({right})=>right||'auto'};
  left: ${({left})=>left||'auto'};
  bottom: ${({bottom})=>bottom||'auto'};
`;

type TutorialProps = {
  visible: boolean;
  text: string;
  step?: number;
  menuOpen?: boolean;
  topBar?: boolean;
};

const Tutorial: React.FC<TutorialProps> = ({ visible, text, topBar }) => {
  if (!visible) return null;
  if (topBar) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        background: 'rgba(255,236,179,0.98)',
        color: '#6d4c41',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        textAlign: 'center',
        zIndex: 9999,
        padding: '0.7rem 0',
        boxShadow: '0 2px 16px #a1887f44',
      }}>
        {text}
      </div>
    );
  }
  return null;
};

export default Tutorial;
