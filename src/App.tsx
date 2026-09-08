import React from 'react';
import { CalendarScreen } from './features/calendar/views/CalendarScreen';
import { AnimatedBackground } from './features/common/components/AnimatedBackground';

export const App: React.FC = () => {
  return (
    <div className="calendo-app">
      <AnimatedBackground />
      <CalendarScreen />
    </div>
  );
};

export default App;
