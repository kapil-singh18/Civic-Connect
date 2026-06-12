import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    title: { type: String, default: 'Notification' },
    type: { type: String, enum: ['new_report', 'admin_reply', 'progress', 'system'], default: 'system' },
    read: { type: Boolean, default: false },
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
