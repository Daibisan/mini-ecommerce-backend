export interface ValidationErrorItem {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: ValidationErrorItem[];
}
