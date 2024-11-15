class UnimplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnimplementedError';
    Object.setPrototypeOf(this, UnimplementedError.prototype);
  }
}

export { UnimplementedError };
