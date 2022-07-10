import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Content, ContentSchema } from './content.model';
import { Platform, PlatformSchema } from './platform.model';

export type ButtonDocument = Button & Document;

@Schema({ _id: false })
export class Button {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: ContentSchema, required: true })
  text: Content;
  @Prop({ type: PlatformSchema })
  icon: Platform;
  @Prop({ type: String })
  callback: string;
}

export const ButtonSchema = SchemaFactory.createForClass(Button);
export const ButtonModel = mongoose.model(Button.name, ButtonSchema);
