import Image from "next/image";
import { CLASS_IMAGE_PATHS } from "@/lib/class-colors";
import type { ClassName } from "@/lib/types";

interface Props {
  name: ClassName;
  size?: number;
  className?: string;
}

export function ClassIcon({ name, size = 24, className = "" }: Props) {
  return (
    <Image
      src={CLASS_IMAGE_PATHS[name]}
      alt={name}
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
