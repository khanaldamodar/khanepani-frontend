

import Footer from "@/components/global/Footer";
import NavbarServer from "@/components/global/NavbarServer";
import Navigation from "@/components/global/navigation";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "गगनगौडा भू.पु. खानेपानी समिती",
  description: "गगनगौडा भू.पु. खानेपानी समिती",
  icons:{
    icon: '/image.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
  
      <div>
       <NavbarServer/>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    
  );
}
