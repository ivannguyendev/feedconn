import DebugLib from "debug";
export const Debug = (namespace: string) => DebugLib("feedconn:" + namespace);
