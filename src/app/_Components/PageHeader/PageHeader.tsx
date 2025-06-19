import { JSX } from "react";
import Image from "next/image";
import { getLocale } from "next-intl/server";

const PageHeader = async ({ title }: { title?: string | JSX.Element }) => {
  const locale = await getLocale();
  const isArabic = locale === "ar";
  return (
    <div className="relative flex items-center justify-center pt-44 pb-12">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/header.webp"
          alt="Header background"
          fill
          className="object-cover object-center"
          priority
          quality={80}
          sizes="100vw"
        />
      </div>
      <div
        className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent
          z-[1]"
      />
      <h2
        className={`text-3xl ${isArabic ? "font-cairo" : "font-righteous"} absolute z-10`}
      >
        {title}
      </h2>
    </div>
  );
};

export default PageHeader;
