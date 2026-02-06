import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    category: 'health' | 'career' | 'learning' | 'financial' | 'personal';
    deadline?: Date;
    status: 'active' | 'completed' | 'abandoned';
    progress: number; // 0-100
    priority: 'low' | 'medium' | 'high';
}

const GoalSchema = new Schema<IGoal>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: {
        type: String,
        enum: ['health', 'career', 'learning', 'financial', 'personal'],
        default: 'personal'
    },
    deadline: { type: Date },
    status: {
        type: String,
        enum: ['active', 'completed', 'abandoned'],
        default: 'active'
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
}, { timestamps: true });

export default mongoose.model<IGoal>('Goal', GoalSchema);
