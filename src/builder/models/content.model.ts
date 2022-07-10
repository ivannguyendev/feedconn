import { Prop, ModelOptions, getModelForClass } from '@typegoose/typegoose';

export type ContentDocument = Content & Document;

@ModelOptions({ schemaOptions: { _id: false } })
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

export const ContentModel = getModelForClass(Content);
