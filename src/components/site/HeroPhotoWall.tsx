import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/assets/tutoring-hero.jpg";
import schoolImage from "@/assets/school-support.jpg";
import adultImage from "@/assets/adult-learning.jpg";

const photos = [heroImage, schoolImage, adultImage];

/** Opposing vertical photo streams, with an extra scroll-driven counter-motion. */
export const HeroPhotoWall = () => {
  const wall = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: wall, offset: ["start start", "end start"] });
  const up = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const down = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div ref={wall} className="hero-photo-wall absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
      <div className="hero-photo-columns">
        {[0, 1, 2].map((column) => (
          <motion.div key={column} className="hero-photo-column" style={{ y: reduced ? 0 : column % 2 === 0 ? up : down }}>
            <div className={`hero-photo-stream ${column % 2 ? "hero-photo-stream-reverse" : ""}`}>
              {[0, 1].map((copy) => (
                <div key={copy} className="hero-photo-set">
                  {photos.map((_, index) => (
                    <motion.div key={index} className="hero-photo-tile"
                      initial={reduced ? false : { opacity: 0, y: column % 2 ? -60 : 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : (column + index) * 0.16 }}>
                      <img src={photos[(index + column) % photos.length]} alt="" width={1536} height={1024} loading={copy === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};