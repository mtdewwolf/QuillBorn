declare module "@sentry/webpack-plugin" {
  import type { Compiler, WebpackPluginInstance } from "webpack";

  export type SentryCliPluginOptions = Record<string, unknown>;

  export default class SentryCliPlugin implements WebpackPluginInstance {
    constructor(options?: SentryCliPluginOptions);
    apply(compiler: Compiler): void;
    static downloadCliBinary(logger: { log: (...args: unknown[]) => void }): Promise<void>;
  }
}
