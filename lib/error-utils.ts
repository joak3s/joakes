export type ActionResponse<T = any> = {
  data?: T;
  error?: string;
  success?: boolean;
}

export async function createErrorResponse(message: string, details?: any): Promise<ActionResponse> {
  console.error('Action error:', message, details);
  return {
    error: message,
    success: false
  };
}

export async function createSuccessResponse<T>(data: T, message?: string): Promise<ActionResponse<T>> {
  if (message) {
    console.log('Action success:', message);
  }
  return {
    data,
    success: true
  };
}

export async function handleActionError(error: any, message: string): Promise<ActionResponse> {
  console.error('Handled action error:', message, error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return {
    error: `${message}: ${errorMessage}`,
    success: false
  };
} 