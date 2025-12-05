"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface GalleryImage {
  src: string;
  title: string;
}

export default function GalleryPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);


  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}gallery`);
        if (response.data && Array.isArray(response.data)) {
          const fetchedImages: GalleryImage[] = response.data.flatMap((item) =>
            item.images.map((img: string) => ({
              src: img,
              title: item.title || "Untitled",
            }))
          );
          setGalleryImages(fetchedImages);
        }
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchGalleryItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const getFullImageUrl = (imgPath: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
    return `${baseUrl}${imgPath}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Gallery</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryImages.map((imgObj, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <img
              src={getFullImageUrl(imgObj.src)}
              alt={imgObj.title}
              className="rounded shadow-md w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <p className="text-white text-sm px-2 text-center">{imgObj.title}</p>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          index={photoIndex}
          slides={galleryImages.map((imgObj) => ({
            src: getFullImageUrl(imgObj.src),
            title: imgObj.title,
          }))}
        />
      )}
    </div>
  );
}
