export class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  error?: string;

  constructor(
    success: boolean,
    message: string,
    statusCode: number,
    data?: T,
    error?: string,
  ) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.error = error;
  }

  static ok<T>(data: T, message = 'Request successful'): ApiResponse<T> {
    return new ApiResponse(true, message, 200, data);
  }

  static success<T>(data: T, message = 'Request successful'): ApiResponse<T> {
    return ApiResponse.ok(data, message);
  }

  static created<T>(data: T, message = 'Resource created successfully'): ApiResponse<T> {
    return new ApiResponse(true, message, 201, data);
  }

  static error(
    message: string,
    statusCode = 500,
    error?: string,
  ): ApiResponse<null> {
    return new ApiResponse(false, message, statusCode, null, error);
  }
}
