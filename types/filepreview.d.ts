declare module "filepreview" {
  export function generate(
    source: string,
    destination: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
    },
    callback: (error: Error | null) => void
  ): void;

  export default {
    generate,
  };
}
