import mongoose, { Document, Schema } from 'mongoose';

export interface IDailyLog extends Document {
    user: mongoose.Types.ObjectId;
    date: string; // YYYY-MM-DD
    sleepHours?: number;
    studyHours?: number;
    mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
    energyLevel?: 'high' | 'medium' | 'low';
    notes?: string;
    tasksCompleted?: number; // Snapshot aggregation
    habitsCompleted?: string[]; // IDs of habits
}

const DailyLogSchema = new Schema<IDailyLog>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Index for fast lookup
    sleepHours: { type: Number },
    studyHours: { type: Number },
    mood: {
        type: String,
        enum: ['great', 'good', 'neutral', 'bad', 'terrible']
    },
    energyLevel: {
        type: String,
        enum: ['high', 'medium', 'low']
    },
    notes: { type: String },
    tasksCompleted: { type: Number, default: 0 },
    habitsCompleted: [{ type: Schema.Types.ObjectId, ref: 'Habit' }],
}, { timestamps: true });

// Ensure one log per user per day
DailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);
