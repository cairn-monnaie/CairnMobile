declare module vue {
  interface Vue {
    readonly $refs: { [key: string]: Vue & { nativeView: any } };
  }
}
