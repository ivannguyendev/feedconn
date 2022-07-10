import { Message, MessageModel } from "./models";

export class FeedconnBuilder {
  static render(obj: Partial<Message>) {
    const modelData = new MessageModel(obj);
    return modelData.toObject()
  }
}
