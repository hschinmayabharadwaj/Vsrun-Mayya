import clsx from 'clsx';

export function Icon({
  name,
  filled = false,
  className,
  size = 24,
}: {
  name: string;
  filled?: boolean;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={clsx('material-symbols-outlined leading-none', className)}
      style={{
        fontSize: size,
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
