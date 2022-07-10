import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type ContentDocument = Content & Document;

@Schema({_id: false})
export class Content {
  @Prop({
    type: String,
    required: true,
    set: function (v) {
      return v ?? this.vi ?? this.en ?? this.fr ?? 'no content';
    },
  })
  all: string;
  @Prop({ type: String })
  en?: string;
  @Prop({ type: String })
  vi?: string;
  @Prop({ type: String })
  fr?: string;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
export const ContentModel = mongoose.model(Content.name, ContentSchema);
