
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, Target, Calendar } from 'lucide-react';

interface TimeEntry {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  hoursWorked: number;
  project?: string;
}

interface AnalyticsProps {
  timeEntries: TimeEntry[];
}

const Analytics = ({ timeEntries }: AnalyticsProps) => {
  // Calculate daily hours for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
  }).reverse();

  const dailyData = last7Days.map(date => {
    const dayEntries = timeEntries.filter(entry => entry.date.includes(date.split(', ')[1] || date));
    const totalHours = dayEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
    return { date, hours: parseFloat(totalHours.toFixed(1)) };
  });

  // Calculate weekly averages
  const weeklyAverage = timeEntries.length > 0 
    ? (timeEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0) / Math.max(timeEntries.length / 5, 1)).toFixed(1)
    : '0.0';

  const todayHours = timeEntries
    .filter(entry => entry.date === new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
    .reduce((sum, entry) => sum + entry.hoursWorked, 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-orange-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{todayHours.toFixed(1)}h</div>
          </CardContent>
        </Card>

        <Card className="border-sky-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Weekly Avg
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-500">{weeklyAverage}h</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {dailyData.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Total Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{timeEntries.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Hours Chart */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">Daily Hours (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
