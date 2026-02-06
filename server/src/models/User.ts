import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    firebaseUid: string;
    email: string;
    name: string;
    goals: any[];
    focusHours: object;
    sleepSchedule: object;
    isAdmin: boolean;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    goals: [{ type: Schema.Types.ObjectId, ref: 'Goal' }],
    focusHours: { type: Object, default: {} },
    sleepSchedule: { type: Object, default: {} },
    isAdmin: { type: Boolean, default: false },
}, {
    timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);
