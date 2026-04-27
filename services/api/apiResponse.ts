// lib/type/ApiResponse.ts

import { Metadata } from "../../lib/types/Metadata";

// Generic API response wrapper used for backend communication.
export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  requestId?: string;
  timestamp?: string;
  data: T | null;
  metaData?: Metadata;
}