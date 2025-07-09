
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Coffee, Timer, Play, Pause } from 'lucide-react';

interface BreakReminderProps {
  isClockedIn: boolean;
  clockInTime: Date | null;
}

const BreakReminder = ({ isClockedIn, clockInTime }: BreakReminderProps) => {
  const [breakEnabled, setBreakEnabled] = useState(false);
  const [breakInterval, setBreakInterval] = useState(60); // minutes
  const [onBreak, setOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [nextBreakTime, setNextBreakTime] = useState<Date | null>(null);
  const [timeUntilBreak, setTimeUntilBreak] = useState<string>('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('timepunch-break-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setBreakEnabled(settings.enabled || false);
      setBreakInterval(settings.interval || 60);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timepunch-break-settings', JSON.stringify({
      enabled: breakEnabled,
      interval: breakInterval
    }));
  }, [breakEnabled, breakInterval]);

  useEffect(() => {
    if (breakEnabled && isClockedIn && clockInTime && !onBreak) {
      const nextBreak = new Date(clockInTime.getTime() + (breakInterval * 60 * 1000));
      setNextBreakTime(nextBreak);
    } else {
      setNextBreakTime(null);
    }
  }, [breakEnabled, isClockedIn, clockInTime, breakInterval, onBreak]);

  useEffect(() => {
    if (!nextBreakTime || onBreak) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeDiff = nextBreakTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        // Time for a break!
        if (Notification.permission === 'granted') {
          new Notification('TimePunch Break Reminder', {
            body: 'Time to take a break! You\'ve been working for a while.',
            icon: 'data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23f97316\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3ccircle cx=\'12\' cy=\'12\' r=\'10\'/%3e%3cpolyline points=\'12,6 12,12 16,14\'/%3e%3c/svg%3e'
          });
        }
        setTimeUntilBreak('Break time!');
        return;
      }

      const minutes = Math.floor(timeDiff / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setTimeUntilBreak(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextBreakTime, onBreak]);

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const startBreak = () => {
    setOnBreak(true);
    setBreakStartTime(new Date());
  };

  const endBreak = () => {
    setOnBreak(false);
    setBreakStartTime(null);
    if (clockInTime) {
      const nextBreak = new Date(Date.now() + (breakInterval * 60 * 1000));
      setNextBreakTime(nextBreak);
    }
  };

  const getCurrentBreakDuration = () => {
    if (!onBreak || !breakStartTime) return '0:00';
    const now = new Date();
    const diff = now.getTime() - breakStartTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-green-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
          <Coffee className="w-5 h-5" />
          Break Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Enable break reminders</span>
          <Switch
            checked={breakEnabled}
            onCheckedChange={(checked) => {
              setBreakEnabled(checked);
              if (checked) requestNotificationPermission();
            }}
          />
        </div>

        {breakEnabled && (
          <>
            {/* Interval Setting */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Remind every</span>
              <select
                value={breakInterval}
                onChange={(e) => setBreakInterval(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1 bg-background"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            {/* Break Status */}
            {isClockedIn && (
              <div className="space-y-2">
                {onBreak ? (
                  <div className="text-center space-y-2">
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                      On Break
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Duration: {getCurrentBreakDuration()}
                    </div>
                    <Button
                      onClick={endBreak}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      End Break
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    {timeUntilBreak === 'Break time!' ? (
                      <div className="text-lg font-semibold text-orange-600 dark:text-orange-400 animate-pulse">
                        Time for a break!
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Next break in: {timeUntilBreak}
                      </div>
                    )}
                    <Button
                      onClick={startBreak}
                      size="sm"
                      variant="outline"
                      className="border-green-300 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Take Break Now
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BreakReminder;
