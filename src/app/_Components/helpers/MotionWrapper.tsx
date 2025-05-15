import { useState, useEffect, ReactNode, HTMLAttributes, useRef } from "react";
import useIsDesktop from "@/app/hooks/useIsDesktop";
import type { ForwardRefComponent, HTMLMotionProps } from "framer-motion";

let cachedMotionDiv: typeof import("framer-motion").motion.div | null = null;

function getCachedMotionDiv() {
  return cachedMotionDiv;
}

async function loadMotionDiv() {
  if (!cachedMotionDiv) {
    const mod = await import("framer-motion");
    cachedMotionDiv = mod.motion.div;
  }
  return cachedMotionDiv;
}

type Props = {
  children: ReactNode;
  motionProps?: HTMLMotionProps<"div"> & { key?: React.Key };
  fallbackProps?: HTMLAttributes<HTMLDivElement>;
  className?: string;
};

export default function MotionWrapper({
  children,
  motionProps = {},
  fallbackProps,
  className,
}: Props) {
  const isDesktop = useIsDesktop();
  const cachedDiv = getCachedMotionDiv();

  const [MotionDiv, setMotionDiv] = useState<ForwardRefComponent<
    HTMLDivElement,
    HTMLMotionProps<"div">
  > | null>(cachedDiv);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (isDesktop && !cachedDiv) {
      loadMotionDiv().then((div) => {
        if (mountedRef.current) {
          setMotionDiv(() => div);
        }
      });
    }

    return () => {
      mountedRef.current = false;
    };
  }, [isDesktop, cachedDiv]);

  if (isDesktop && MotionDiv) {
    const { key, ...rest } = motionProps;
    return (
      <MotionDiv key={key} {...rest} className={className}>
        {children}
      </MotionDiv>
    );
  }

  return (
    <div {...fallbackProps} className={className}>
      {children}
    </div>
  );
}
