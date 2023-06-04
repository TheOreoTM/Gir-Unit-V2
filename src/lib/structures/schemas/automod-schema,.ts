import mongoose, { Document, Schema } from 'mongoose';

interface AutomodDocument extends Document {
  _id: string;
  bannedWords: {
    bannedWords: Map<string, boolean>;
    enabled: boolean;
    ignoredRoles: string[];
    ignoredChannels: string[];
    violations: number;
    duration: number;
    threshold: number;
    action: string;
    punishmentDuration: number;
    shouldAlert?: boolean;
    shouldLog?: boolean;
    shouldDelete?: boolean;
  };
}

// Create the automod schema
const automodSchema = new Schema<AutomodDocument>({
  _id: { type: String, required: true }, // Guild ID
  bannedWords: {
    bannedWords: { type: Map, of: Boolean, required: true, default: new Map() },
    enabled: { type: Boolean, required: true, default: false },
    ignoredRoles: { type: [String], required: true, default: [] },
    ignoredChannels: { type: [String], required: true, default: [] },
    violations: { type: Number, required: true, default: 3 },
    duration: { type: Number, required: true, default: 300 },
    threshold: { type: Number, required: true, default: 100 },
    action: { type: String, required: true, default: 'warn' },
    punishmentDuration: { type: Number, required: true, default: 0 },
    shouldAlert: { type: Boolean, required: false },
    shouldLog: { type: Boolean, required: false },
    shouldDelete: { type: Boolean, required: false },
  },
});

export default mongoose.model('automod', automodSchema, 'automod');
