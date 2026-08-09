import { useEcoPhoto } from "@/hooks/useEcoPhoto";

type Props = {
  query: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

export function EcoPhoto({ query, alt, className, width = 640, height = 480 }: Props) {
  const src = useEcoPhoto(query, width, height);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={width}
      height={height}
      className={className}
    />
  );
}
