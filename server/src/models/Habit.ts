import mongoose, { Document, Schema } from 'mongoose';

export interface IHabit extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'weekdays' | 'weekends';
    streak: number;
    lastCompletedDate?: Date;
}

const HabitSchema = new Schema<IHabit>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'weekdays', 'weekends'],
        default: 'daily'
    },
    streak: { type: Number, default: 0 },
    lastCompletedDate: { type: Date },
}, { timestamps: true });

export default mongoose.model<IHabit>('Habit', HabitSchema);
