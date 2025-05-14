import { useState, useEffect, ReactNode, HTMLAttributes, useRef } from "react";
import useIsDesktop from "@/app/hooks/useIsDesktop";
import type { HTMLMotionProps } from "framer-motion";

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
  const [MotionDiv, setMotionDiv] = useState<React.ComponentType<any> | null>(
    null,
  );
  const isDesktop = useIsDesktop();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (isDesktop && !MotionDiv) {
      import("framer-motion").then((mod) => {
        if (mountedRef.current) {
          setMotionDiv(() => mod.motion.div);
        }
      });
    }

    return () => {
      mountedRef.current = false;
    };
  }, [isDesktop, MotionDiv]);

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
