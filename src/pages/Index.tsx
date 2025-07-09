import React, { useState, useEffect } from 'react';
import { Clock, Download, Sun, Moon, Calendar, BarChart3, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Analytics from '@/components/Analytics';
import ProjectTracker from '@/components/ProjectTracker';
import BreakReminder from '@/components/BreakReminder';

interface TimeEntry {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  hoursWorked: number;
  project?: string;
}

interface Project {
  id: string;
  name: string;
  color: string;
  totalHours: number;
}

const TimePunch = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('timer');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('timepunch-entries');
    const savedClockState = localStorage.getItem('timepunch-clocked-in');
    const savedClockTime = localStorage.getItem('timepunch-clock-time');
    const savedTheme = localStorage.getItem('timepunch-dark-mode');
    const savedProjects = localStorage.getItem('timepunch-projects');
    const savedCurrentProject = localStorage.getItem('timepunch-current-project');

    if (savedEntries) {
      setTimeEntries(JSON.parse(savedEntries));
    }
    
    if (savedClockState === 'true') {
      setIsClockedIn(true);
      if (savedClockTime) {
        setClockInTime(new Date(savedClockTime));
      }
    }

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'true');
    }

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }

    if (savedCurrentProject) {
      setCurrentProject(savedCurrentProject);
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('timepunch-dark-mode', isDarkMode.toString());
  }, [isDarkMode]);

  // Save projects when they change
  useEffect(() => {
    localStorage.setItem('timepunch-projects', JSON.stringify(projects));
  }, [projects]);

  // Save current project when it changes
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem('timepunch-current-project', currentProject);
    } else {
      localStorage.removeItem('timepunch-current-project');
    }
  }, [currentProject]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      formatted: `${hours}h ${minutes}m`,
      hours: hours + minutes / 60
    };
  };

  const handleClockToggle = () => {
    if (!isClockedIn) {
      // Clock In
      const now = new Date();
      setClockInTime(now);
      setIsClockedIn(true);
      localStorage.setItem('timepunch-clocked-in', 'true');
      localStorage.setItem('timepunch-clock-time', now.toISOString());
    } else {
      // Clock Out
      if (clockInTime) {
        const now = new Date();
        const duration = calculateDuration(clockInTime, now);
        
        const newEntry: TimeEntry = {
          id: Date.now().toString(),
          date: formatDate(clockInTime),
          clockIn: formatTime(clockInTime),
          clockOut: formatTime(now),
          duration: duration.formatted,
          hoursWorked: duration.hours,
          project: currentProject || undefined
        };

        const updatedEntries = [newEntry, ...timeEntries];
        setTimeEntries(updatedEntries);
        localStorage.setItem('timepunch-entries', JSON.stringify(updatedEntries));

        // Update project hours
        if (currentProject) {
          setProjects(prev => prev.map(project => 
            project.id === currentProject 
              ? { ...project, totalHours: project.totalHours + duration.hours }
              : project
          ));
        }
      }
      
      setIsClockedIn(false);
      setClockInTime(null);
      localStorage.removeItem('timepunch-clocked-in');
      localStorage.removeItem('timepunch-clock-time');
    }
  };

  const getCurrentDuration = () => {
    if (!isClockedIn || !clockInTime) return '0h 0m';
    return calculateDuration(clockInTime, currentTime).formatted;
  };

  const exportToCsv = () => {
    const headers = ['Date', 'Clock In', 'Clock Out', 'Duration', 'Hours Worked', 'Project'];
    const csvContent = [
      headers.join(','),
      ...timeEntries.map(entry => 
        [entry.date, entry.clockIn, entry.clockOut, entry.duration, entry.hoursWorked.toFixed(2), entry.project || 'No Project'].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timepunch-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToTxt = () => {
    const txtContent = [
      'TimePunch Work Log',
      '==================',
      '',
      ...timeEntries.map(entry => 
        `Date: ${entry.date}\nClock In: ${entry.clockIn}\nClock Out: ${entry.clockOut}\nDuration: ${entry.duration}\nHours: ${entry.hoursWorked.toFixed(2)}\nProject: ${entry.project || 'No Project'}\n`
      )
    ].join('\n');

    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timepunch-log-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const totalHoursWorked = timeEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-sky-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">TimePunch</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-orange-500" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="data-[state=checked]:bg-sky-500"
            />
            <Moon className="w-5 h-5 text-sky-500" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="breaks" className="flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Breaks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-8">
            {/* Current Time Display */}
            <Card className="border-2 border-orange-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold text-gray-800 dark:text-white mb-2">
                    {formatTime(currentTime)}
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-300">
                    {formatDate(currentTime)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clock In/Out Button */}
            <div className="text-center">
              <Button
                onClick={handleClockToggle}
                size="lg"
                className={`w-64 h-20 text-2xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  isClockedIn
                    ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-200 dark:shadow-sky-900'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200 dark:shadow-orange-900'
                } shadow-lg`}
              >
                {isClockedIn ? 'Clock Out' : 'Clock In'}
              </Button>
              
              {isClockedIn && (
                <div className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Current session: {getCurrentDuration()}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-orange-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Total Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">{timeEntries.length}</div>
                </CardContent>
              </Card>
              
              <Card className="border-sky-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Total Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-sky-500">{totalHoursWorked.toFixed(1)}h</div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${isClockedIn ? 'text-green-500' : 'text-gray-500'}`}>
                    {isClockedIn ? 'Active' : 'Idle'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Export Buttons */}
            {timeEntries.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={exportToCsv}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-950"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  onClick={exportToTxt}
                  variant="outline"
                  className="border-sky-300 text-sky-600 hover:bg-sky-50 dark:border-sky-600 dark:text-sky-400 dark:hover:bg-sky-950"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export TXT
                </Button>
              </div>
            )}

            {/* Time Entries Log */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                  <Calendar className="w-5 h-5" />
                  Work Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timeEntries.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No time entries yet. Clock in to start tracking your work!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timeEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 dark:text-white">{entry.date}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {entry.clockIn} - {entry.clockOut}
                          </div>
                          {entry.project && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Project: {projects.find(p => p.id === entry.project)?.name || 'Unknown'}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 md:mt-0 md:text-right">
                          <div className="font-bold text-lg text-sky-600 dark:text-sky-400">{entry.duration}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {entry.hoursWorked.toFixed(2)} hours
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics timeEntries={timeEntries} />
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <ProjectTracker
                projects={projects}
                currentProject={currentProject}
                onProjectChange={setCurrentProject}
                onAddProject={handleAddProject}
              />
            </div>
          </TabsContent>

          <TabsContent value="breaks">
            <BreakReminder
              isClockedIn={isClockedIn}
              clockInTime={clockInTime}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TimePunch;
