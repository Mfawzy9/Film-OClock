import { ReactNode, HTMLAttributes } from "react";
import useIsDesktop from "@/app/hooks/useIsDesktop";
import { motion, type HTMLMotionProps } from "framer-motion";

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

  if (isDesktop) {
    const { key, ...rest } = motionProps;
    return (
      <motion.div key={key} {...rest} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <div {...fallbackProps} className={className}>
      {children}
    </div>
  );
}
