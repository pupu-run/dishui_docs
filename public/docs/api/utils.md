# 工具函数

## formatDate

格式化日期函数。

```typescript
function formatDate(date: Date, format: string): string;
```

## debounce

防抖函数。

```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void;
```

