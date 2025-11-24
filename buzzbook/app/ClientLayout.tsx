"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideOnRoutes = ["/login", "/signup","/forgot"];
  const shouldHide = hideOnRoutes.includes(pathname);

  return (
    <>
      {!shouldHide && <Header />}
      <main className="flex-grow">{children}</main>
      {!shouldHide && <Footer />}
    </>
  );
}
