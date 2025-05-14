import Image from "next/image";
import formBg from "../../../../../public/images/formsBg.jpg";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesStore = await cookies();
  const sessionToken = cookiesStore.get("session")?.value;
  const loggedOutStatus = cookiesStore.get("loggedOut")?.value;

  if (sessionToken && loggedOutStatus === "false") {
    redirect("/");
  }

  return (
    <div className="relative min-h-screen w-full py-20 flex items-center justify-center">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={formBg}
          alt="Authentication background"
          fill
          sizes="100vw"
          className="object-cover object-top"
          quality={80}
          placeholder="blur"
          priority
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Gradient at bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent
          z-0"
      />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
