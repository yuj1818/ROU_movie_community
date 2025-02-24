import { useState, useEffect, useRef } from 'react';

const LazyImg = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef(null);
  const observer = useRef();

  const intersectionObserver = (entries, io) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        io.unobserve(entry.target);
        setIsLoading(true);
      }
    });
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(intersectionObserver);
    imgRef.current && observer.current.observe(imgRef.current);
  }, []);

  return (
    <img
      ref={imgRef}
      src={isLoading ? src : null}
      alt={alt}
      className={className}
    />
  );
};

export default LazyImg;
