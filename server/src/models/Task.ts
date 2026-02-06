import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    duration?: number; // Estimated duration in minutes
    completed: boolean;
    completedAt?: Date;
    priority: 'low' | 'medium' | 'high';
    scheduledFor?: Date;
    goal?: mongoose.Types.ObjectId; // Optional link to a parent goal
}

const TaskSchema = new Schema<ITask>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    scheduledFor: { type: Date, default: Date.now },
    goal: { type: Schema.Types.ObjectId, ref: 'Goal' },
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);
