import Image from "next/image";
import { ILLUSTRATION_HEIGHT, ILLUSTRATION_WIDTH, type Illustration } from "@/lib/images/display";

export default function IllustrationFigure({
  illustration,
  preload = false,
  sizes = "(min-width: 768px) 720px, 100vw",
  className = "",
}: {
  illustration: Illustration;
  preload?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={`relative overflow-hidden rounded-2xl bg-[#E8F5F2] ${className}`}>
      <Image
        src={illustration.src}
        alt={illustration.alt}
        width={ILLUSTRATION_WIDTH}
        height={ILLUSTRATION_HEIGHT}
        sizes={sizes}
        preload={preload}
        className="w-full h-auto"
      />
      <figcaption className="absolute left-3 bottom-3 rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-neutral-700">
        Illustration
      </figcaption>
    </figure>
  );
}
