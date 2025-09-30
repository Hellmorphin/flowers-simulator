import React from 'react';
import styled from 'styled-components';
import Pot from './Pot';
import Flower from './Flower';

const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: url('../assets/Polka.jpg') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
`;

const PotWrapper = styled.div`
  position: absolute;
  left: 50%;
  bottom: 28vh;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 2vh;
  left: 0;
  width: 100vw;
  text-align: center;
  color: #fffde7;
  font-size: 1rem;
  opacity: 0.8;
  z-index: 3;
  a {
    color: #ffb300;
    text-decoration: underline;
    cursor: pointer;
  }
`;

type MainScreenProps = {
  flowerSize: number;
  flowerVisible: boolean;
  onWater: () => void;
  onFertilize: () => void;
  lastWater: number;
  lastFertilize: number;
};

const MainScreen: React.FC<MainScreenProps> = ({
  flowerSize,
  flowerVisible,
  onWater,
  onFertilize,
  lastWater,
  lastFertilize,
}) => {
  return (
    <Background>
      <PotWrapper>
        <Flower size={Math.max(24, flowerSize * 0.8)} visible={flowerVisible} />
        <div style={{marginTop: 20}}>
          <Pot />
        </div>
      </PotWrapper>
      <Footer>
        Ver. 1.0 by{' '}
        <a href="https://t.me/Hellmorphin" target="_blank" rel="noopener noreferrer">
          Hellmorphin
        </a>
      </Footer>
    </Background>
  );
};

export default MainScreen;
