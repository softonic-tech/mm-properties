type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  onAnimationEnd?: () => void;
};

export function Image({ src, alt, className = "", fill, onAnimationEnd }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onAnimationEnd={onAnimationEnd}
      className={fill ? `absolute inset-0 h-full w-full ${className}` : className}
    />
  );
}
