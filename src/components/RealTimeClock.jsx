import { useEffect, useState } from 'react';

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm font-medium text-black dark:text-black">
      🕒 {time}
    </div>
  );
};

export default RealTimeClock;
