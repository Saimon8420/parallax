export class ApiError extends Error {
  source: string;
  status: number;

  constructor(source: string, status: number, message?: string) {
    super(message ?? `${source} request failed (${status})`);
    this.name = "ApiError";
    this.source = source;
    this.status = status;
  }
}
