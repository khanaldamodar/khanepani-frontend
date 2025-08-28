

import Footer from "@/components/global/Footer";
import NavbarServer from "@/components/global/NavbarServer";
import Navigation from "@/components/global/navigation";

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
