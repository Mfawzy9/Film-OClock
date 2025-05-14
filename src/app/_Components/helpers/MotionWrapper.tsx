import { motion, MotionProps } from "framer-motion";
import { ElementType, ReactNode, ComponentPropsWithoutRef } from "react";

type MotionWrapperProps<T extends ElementType> = {
  as?: T;
  isDesktop: boolean;
  children: ReactNode;
  className?: string;
} & MotionProps &
  ComponentPropsWithoutRef<T>;

export default function MotionWrapper<T extends ElementType = "div">({
  isDesktop,
  children,
  className,
  as,
  ...rest
}: MotionWrapperProps<T>) {
  const Component = as || "div";

  if (!isDesktop) {
    return (
      <Component className={className} {...rest}>
        {children}
      </Component>
    );
  }

  const MotionComponent = motion.create(Component) as ElementType;
  return (
    <MotionComponent className={className} {...rest}>
      {children}
    </MotionComponent>
  );
}
