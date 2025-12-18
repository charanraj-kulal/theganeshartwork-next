import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Decorior - Personalized Photo Frames & Home Decor",
  description: "Decorior.in offers personalized home decor and frames with 7 years of expertise. We deliver unique, high-quality products within Bidar, Kalaburagi city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <WhatsAppButton />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
