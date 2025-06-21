import { ReactNode, HTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type Props = {
  children: ReactNode;
  motionProps?: HTMLMotionProps<"div"> & { key?: React.Key };
  fallbackProps?: HTMLAttributes<HTMLDivElement>;
  className?: string;
  isDesktop?: boolean;
};

export default function MotionWrapper({
  children,
  motionProps = {},
  fallbackProps,
  className,
  isDesktop,
}: Props) {
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
