"use client";
import { useOnlineStatus } from "@/app/hooks/useOnlineStatus";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { PiCellSignalXBold } from "react-icons/pi";
import { toast } from "sonner";

const NoInternetToast = () => {
  const isOnline = useOnlineStatus();
  const t = useTranslations("NoConnection");

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!isOnline && toastIdRef.current === null) {
      toastIdRef.current = toast.error(t("Title"), {
        duration: Infinity,
        description: t("description"),
        className: "!text-red-200 4xl:!text-xl",
        descriptionClassName: "!text-gray-300 4xl:!text-base",
        icon: (
          <PiCellSignalXBold className="text-white text-2xl animate-pulse" />
        ),
      });
    } else if (isOnline && toastIdRef.current !== null) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, [isOnline, t]);

  return null;
};

export default NoInternetToast;
