// app/components/NavbarServer.tsx

import Navbar from "./navigation";


export default async function NavbarServer() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}settings`, {
    cache: "force-cache",
    next: { revalidate: 3600 }, // optional ISR
  });

  const navbarData = await res.json();

  return <Navbar data={navbarData} />;
}