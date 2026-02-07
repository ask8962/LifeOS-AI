import Task from '../models/Task';
import DailyLog from '../models/DailyLog';
import mongoose from 'mongoose';

interface DailyStats {
  date: string;
  productivityScore: number;
  tasksCompleted: number;
  totalTasks: number;
  focusHours: number;
  mood: string | null;
  energyLevel: string | null;
}

interface WeeklyAnalytics {
  startDate: string;
  endDate: string;
  averageProductivity: number;
  totalTasksCompleted: number;
  totalFocusHours: number;
  moodTrend: { mood: string; count: number }[];
  energyTrend: { energy: string; count: number }[];
  dailyBreakdown: DailyStats[];
  consistencyScore: number;
  burnoutRisk: 'low' | 'medium' | 'high';
}

/**
 * Calculate productivity score for a given day
 * Formula: (tasksCompleted / totalTasks) * 0.5 + (focusHours / targetHours) * 0.3 + energyBonus * 0.2
 */
export const calculateDailyProductivity = async (
  userId: mongoose.Types.ObjectId,
  date: string,
  targetFocusHours: number = 6
): Promise<DailyStats> => {
  // Get tasks for the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const tasks = await Task.find({
    user: userId,
    scheduledFor: { $gte: startOfDay, $lte: endOfDay }
  });

  const tasksCompleted = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  // Get daily log
  const log = await DailyLog.findOne({ user: userId, date });

  const focusHours = log?.studyHours || 0;
  const mood = log?.mood || null;
  const energyLevel = log?.energyLevel || null;

  // Calculate score components
  const taskScore = totalTasks > 0 ? (tasksCompleted / totalTasks) : 0;
  const focusScore = Math.min(focusHours / targetFocusHours, 1);
  
  // Energy bonus: high = 1, medium = 0.5, low = 0.2
  let energyBonus = 0.5;
  if (energyLevel === 'high') energyBonus = 1;
  else if (energyLevel === 'low') energyBonus = 0.2;

  // Weighted productivity score (0-100)
  const productivityScore = Math.round(
    (taskScore * 0.5 + focusScore * 0.3 + energyBonus * 0.2) * 100
  );

  return {
    date,
    productivityScore,
    tasksCompleted,
    totalTasks,
    focusHours,
    mood,
    energyLevel
  };
};

/**
 * Calculate weekly analytics for a user
 */
export const calculateWeeklyAnalytics = async (
  userId: mongoose.Types.ObjectId,
  endDate: Date = new Date()
): Promise<WeeklyAnalytics> => {
  // Get last 7 days
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const dailyBreakdown: DailyStats[] = [];
  const moodCount: Record<string, number> = {};
  const energyCount: Record<string, number> = {};
  let totalProductivity = 0;
  let totalTasksCompleted = 0;
  let totalFocusHours = 0;
  let daysWithData = 0;

  for (const date of dates) {
    const stats = await calculateDailyProductivity(userId, date);
    dailyBreakdown.push(stats);
    
    if (stats.productivityScore > 0 || stats.totalTasks > 0) {
      daysWithData++;
      totalProductivity += stats.productivityScore;
    }
    
    totalTasksCompleted += stats.tasksCompleted;
    totalFocusHours += stats.focusHours;
    
    if (stats.mood) {
      moodCount[stats.mood] = (moodCount[stats.mood] || 0) + 1;
    }
    if (stats.energyLevel) {
      energyCount[stats.energyLevel] = (energyCount[stats.energyLevel] || 0) + 1;
    }
  }

  // Calculate averages
  const averageProductivity = daysWithData > 0 
    ? Math.round(totalProductivity / daysWithData) 
    : 0;

  // Consistency score: % of days with logged data
  const consistencyScore = Math.round((daysWithData / 7) * 100);

  // Burnout risk detection
  const lowEnergyDays = energyCount['low'] || 0;
  const badMoodDays = (moodCount['bad'] || 0) + (moodCount['terrible'] || 0);
  
  let burnoutRisk: 'low' | 'medium' | 'high' = 'low';
  if (lowEnergyDays >= 4 || badMoodDays >= 3) {
    burnoutRisk = 'high';
  } else if (lowEnergyDays >= 2 || badMoodDays >= 2) {
    burnoutRisk = 'medium';
  }

  // Format trend data
  const moodTrend = Object.entries(moodCount).map(([mood, count]) => ({ mood, count }));
  const energyTrend = Object.entries(energyCount).map(([energy, count]) => ({ energy, count }));

  return {
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    averageProductivity,
    totalTasksCompleted,
    totalFocusHours,
    moodTrend,
    energyTrend,
    dailyBreakdown,
    consistencyScore,
    burnoutRisk
  };
};

/**
 * Get today's dashboard stats
 */
export const getTodayStats = async (userId: mongoose.Types.ObjectId) => {
  const today = new Date().toISOString().split('T')[0];
  const stats = await calculateDailyProductivity(userId, today);
  
  // Get next priority task
  const nextTask = await Task.findOne({
    user: userId,
    completed: false,
    scheduledFor: { $gte: new Date() }
  }).sort({ scheduledFor: 1, priority: -1 });

  return {
    ...stats,
    nextPriorityTask: nextTask ? {
      title: nextTask.title,
      duration: nextTask.duration,
      scheduledFor: nextTask.scheduledFor
    } : null
  };
};
