import React from 'react';



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
