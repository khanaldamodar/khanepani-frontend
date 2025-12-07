import Navigation from "@/components/global/navigation";
import AboutUs from "@/components/Homepage-Components/AboutUs";
import Awards from "@/components/Homepage-Components/Awards";
import BoardMembers from "@/components/Homepage-Components/BoardMember";
import Compositions from "@/components/Homepage-Components/Compositions";
import GalleryWithMembers from "@/components/Homepage-Components/HeroSlider";
import MarqueeBanner from "@/components/Homepage-Components/Marquee";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <MarqueeBanner/>
    <GalleryWithMembers/>
    <AboutUs/>
    {/* <BoardMembers/> */}
    {/* <Awards/> */}
    {/* <Compositions/> */}
    </>
  );
}
