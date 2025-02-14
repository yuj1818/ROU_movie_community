import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

const Container = styled.div`
  height: 30rem;
  width: 100%;
  overflow: hidden;
  max-width: 100%;
`;

const Slide = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
`;

const MovieCarousel = () => {
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: {
      origin: 'center',
      perView: 1.1,
      spacing: 10,
    },
  });

  useEffect(() => {
    if (!isPlaying) return;

    intervalRef.current = setInterval(() => {
      slider.current?.next();
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, slider]);

  return (
    <Container
      ref={sliderRef}
      className="keen-slider"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <Slide className="keen-slider__slide">1</Slide>
      <Slide className="keen-slider__slide">2</Slide>
      <Slide className="keen-slider__slide">3</Slide>
      <Slide className="keen-slider__slide">4</Slide>
    </Container>
  );
};

export default MovieCarousel;
