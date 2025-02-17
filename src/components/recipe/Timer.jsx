import React from 'react';
import styled from 'styled-components';
import { Clock } from 'lucide-react';
import useRecipeTimer from '../../hooks/useRecipeTimer';
import { formatTime } from '../../utils/timeUtils';

const TimerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  background: ${props => props.isActive ? '#fff3e0' : '#f5f5f5'};
  color: ${props => props.isActive ? '#f57c00' : '#666'};
`;

const TimerButton = styled.button`
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const Timer = ({ duration }) => {
  const { time, isActive, hasFinished, startTimer, pauseTimer, resetTimer } = useRecipeTimer(duration);

  const handleClick = () => {
    if (hasFinished) {
      resetTimer();
    } else if (isActive) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  return (
    <TimerContainer isActive={isActive}>
      <Clock size={16} />
      <TimerButton onClick={handleClick}>
        {formatTime(time)}
      </TimerButton>
    </TimerContainer>
  );
};

export default Timer;