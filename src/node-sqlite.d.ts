// Kiểu cho node:sqlite (Node ≥ 22.13). @types/node của dự án còn ở bản 20 nên chưa có module này;
// chỉ khai báo phần sqlite-d1.ts dùng.
declare module "node:sqlite" {
  export type SQLInputValue = null | number | bigint | string | Uint8Array;
  export type SQLOutputValue = null | number | bigint | string | Uint8Array;
  export class StatementSync {
    all(...params: SQLInputValue[]): Record<string, SQLOutputValue>[];
    get(...params: SQLInputValue[]): Record<string, SQLOutputValue> | undefined;
    run(...params: SQLInputValue[]): { changes: number | bigint; lastInsertRowid: number | bigint };
  }
  export class DatabaseSync {
    constructor(path: string, options?: { open?: boolean; readOnly?: boolean });
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
