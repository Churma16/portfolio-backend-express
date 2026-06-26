export interface Meta {
  code: number;
  status: string;
  message: string;
  count?: number;
}

export interface SingleDataResponse<T> {
  meta: Meta;
  data: T;
}

export interface MultipleDataResponse<T> {
  meta: Meta;
  data: T[];
}

export function newMeta(code: number, status: string, message: string): Meta {
  return { code, status, message };
}

export function newMetaWithCount(code: number, status: string, message: string, count: number): Meta {
  return { code, status, message, count };
}

export function newSingleDataResponse<T>(meta: Meta, data: T): SingleDataResponse<T> {
  return { meta, data };
}

export function newMultipleDataResponse<T>(meta: Meta, data: T[]): MultipleDataResponse<T> {
  return { meta, data };
}

export function errorResponse(code: number, status: string, message: string): SingleDataResponse<null> {
  return {
    meta: newMeta(code, status, message),
    data: null,
  };
}
