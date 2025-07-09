
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Folder, Clock } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  color: string;
  totalHours: number;
}

interface ProjectTrackerProps {
  projects: Project[];
  currentProject: string | null;
  onProjectChange: (projectId: string | null) => void;
  onAddProject: (project: Project) => void;
}

const ProjectTracker = ({ projects, currentProject, onProjectChange, onAddProject }: ProjectTrackerProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const projectColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        color: projectColors[projects.length % projectColors.length],
        totalHours: 0
      };
      onAddProject(newProject);
      setNewProjectName('');
      setShowAddForm(false);
    }
  };

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
          <Folder className="w-5 h-5" />
          Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Project */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active:</span>
            {currentProject ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${projects.find(p => p.id === currentProject)?.color || 'bg-gray-500'}`} />
                {projects.find(p => p.id === currentProject)?.name || 'Unknown'}
              </Badge>
            ) : (
              <Badge variant="outline">No Project</Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onProjectChange(null)}
              className="text-xs"
            >
              Clear
            </Button>
          </div>

          {/* Project List */}
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                  currentProject === project.id
                    ? 'bg-orange-100 dark:bg-orange-900/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => onProjectChange(project.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${project.color}`} />
                  <span className="text-sm font-medium">{project.name}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {project.totalHours.toFixed(1)}h
                </div>
              </div>
            ))}
          </div>

          {/* Add Project Form */}
          {showAddForm ? (
            <div className="flex gap-2">
              <Input
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddProject()}
                className="text-sm"
              />
              <Button size="sm" onClick={handleAddProject}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTracker;
