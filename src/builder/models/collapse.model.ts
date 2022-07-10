import { Prop, ModelOptions, getModelForClass } from '@typegoose/typegoose';
import { Content } from './content.model';

export type CollapseDocument = Collapse & Document;

@ModelOptions({ schemaOptions: { _id: false } })
export class Collapse {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ required: true })
  summary: Content;
}

export const CollapseModel = getModelForClass(Collapse);
