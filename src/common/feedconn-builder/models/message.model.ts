import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Button } from './button.model';
import { Content, ContentSchema } from './content.model';
import { Platform, PlatformSchema } from './platform.model';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, enum: ['read', 'unread'], default: 'unread' })
  state: 'unread' | 'read';
  @Prop({ required: true })
  collapse: string;
  @Prop({ type: ContentSchema, required: true, default: () => ({ all: '' }) })
  contents: Content;
  @Prop({ type: ContentSchema, required: true, default: () => ({ all: '' }) })
  headings: Content;
  @Prop({ type: ContentSchema })
  subtitle: Content;
  @Prop()
  template: string;
  @Prop(raw({}))
  data: Record<string, any>;
  @Prop({ type: PlatformSchema })
  url: Platform;
  @Prop({ type: PlatformSchema })
  image: Platform;
  @Prop([])
  buttons: Button[] | Button[][];
  @Prop({ type: PlatformSchema })
  sound: Platform;
  @Prop([String])
  tags: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
export const MessageModel = mongoose.model(Message.name, MessageSchema);
