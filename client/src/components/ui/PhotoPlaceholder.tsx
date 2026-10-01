/**
 * PhotoPlaceholder — Elegant placeholder for photos not yet added
 * Shows a beautiful gradient with a camera icon; renders the real image
 * if the src prop resolves to a valid image.
 */
import { useState } from "react";
import { motion } from "framer-motion";

interface PhotoPlaceholderProps {
  src?: string;
  alt?: string;
  className?: string;
  aspectRatio?: string;
}

export default function PhotoPlaceholder({
  src,
  alt = "Memory photo",
  className = "",
  aspectRatio = "4/3",
}: PhotoPlaceholderProps) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const showPlaceholder = !src || hasError;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ aspectRatio }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {showPlaceholder ? (
        /* Elegant gradient placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blush via-lavender-soft to-cream">
          <motion.span
            className="text-4xl mb-2"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📷
          </motion.span>
          <span className="font-script text-rose-deep/50 text-sm">
            Your photo here
          </span>
        </div>
      ) : (
        <>
          {/* Blur-up loading placeholder */}
          {!loaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-blush via-lavender-soft to-cream animate-pulse" />
          )}
          <motion.img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            onLoad={() => setLoaded(true)}
            onError={() => setHasError(true)}
            loading="lazy"
          />
        </>
      )}
    </motion.div>
  );
}
