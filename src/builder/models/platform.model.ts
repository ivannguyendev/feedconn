import { Prop, ModelOptions, getModelForClass } from '@typegoose/typegoose';

export type PlatformDocument = Platform & Document;

@ModelOptions({ schemaOptions: { _id: false } })
export class Platform {
  @Prop({
    type: String,
    required: true,
    set: function (v) {
      return (
        v ??
        this.web ??
        this.ios ??
        this.android ??
        this.windows ??
        this.chrome ??
        this.huawei ??
        'no content'
      );
    },
  })
  all: string;
  @Prop({ type: String })
  web?: string;
  @Prop({ type: String })
  ios?: string;
  @Prop({ type: String })
  android?: string;
  @Prop({ type: String })
  windows?: string;
  @Prop({ type: String })
  chrome?: string;
  @Prop({ type: String })
  huawei?: string;
}
export const PlatformModel = getModelForClass(Platform);
