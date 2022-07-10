import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Content, ContentSchema } from './content.model';

export type CollapseDocument = Collapse & Document;

@Schema({_id: false})
export class Collapse {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: ContentSchema, required: true })
  summary: Content;
}

export const CollapseSchema = SchemaFactory.createForClass(Collapse);
export const CollapseModel = mongoose.model(Collapse.name, CollapseSchema);
