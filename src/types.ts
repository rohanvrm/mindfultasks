export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  priority: 'low' | 'medium' | 'high';
  urgent: boolean;
  important: boolean;
}

export interface MoodEntry {
  date: string;
  mood: 'happy' | 'neutral' | 'sad';
}