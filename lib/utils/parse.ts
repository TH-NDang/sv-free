export const safeParseInt = (value: string | number | null | undefined): number =>
    parseInt(String(value ?? "0")) || 0;
  