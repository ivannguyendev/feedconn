import { Prop, ModelOptions, getModelForClass } from '@typegoose/typegoose';
import { Content } from './content.model';
import { Platform } from './platform.model';

export type ButtonDocument = Button & Document;

@ModelOptions({ schemaOptions: { _id: false } })
export class Button {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ required: true })
  text: Content;
  @Prop()
  icon: Platform;
  @Prop({ type: String })
  callback: string;
}

export const ButtonModel = getModelForClass(Button);
