import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { getTrendMovieList } from '../../utils/movieApi';
import Url from '../../constants/URL';
import { useNavigate } from 'react-router-dom';
import LazyImg from '../common/LazyImg';

const Container = styled.div`
  width: 91.666667% !important;
  margin-bottom: 3rem;
`;

const Slide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  position: relative;

  .media {
    width: 100%;
    height: 100%;
    z-index: 1;
    object-fit: cover;
    border-radius: 0.5rem;
  }
`;

const Description = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  color: white;
  background-image: linear-gradient(to top right, black, rgba(0, 0, 0, 0) 60%);
  z-index: 2;
  padding: 2rem 40% 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: flex-end;

  .title {
    font-size: 2rem;
    font-family: 'Pretendard-SemiBold';
  }

  .overview {
    font-size: 1rem;
    line-height: 150%;
  }
`;

const MovieCarousel = () => {
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [trendData, setTrendData] = useState();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    renderMode: 'performance',
    slides: {
      origin: 'center',
      perView: 1.3,
      spacing: 20,
    },
  });

  useEffect(() => {
    if (!isPlaying) return;

    intervalRef.current = setInterval(() => {
      slider.current?.next();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, slider]);

  const getTrendData = async () => {
    const res = await getTrendMovieList();
    setTrendData(res);
  };

  useEffect(() => {
    getTrendData();
  }, []);

  return (
    trendData && (
      <Container ref={sliderRef} className="keen-slider">
        {trendData.map((data, idx) => (
          <Slide
            key={data.movie_id}
            className="keen-slider__slide"
            onMouseEnter={() => {
              setHoveredIdx(idx);
              setIsPlaying(false);
            }}
            onMouseLeave={() => {
              setHoveredIdx(null);
              setIsPlaying(true);
            }}
            onClick={() => navigate(`/movie/${data.movie_id}`)}
          >
            {hoveredIdx === idx ? (
              <iframe
                className="media"
                loading="lazy"
                src={`${Url.youtubePath}${data.videos}?autoplay=1&mute=0&loop=1&controls=0&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media"
              />
            ) : (
              <LazyImg
                className="media"
                src={Url.tmdbImgPath + data.backdrop_path}
                alt={data.title}
              />
            )}
            <Description>
              <p className="title">{data.title}</p>
              <p className="overview">{data.overview}</p>
            </Description>
          </Slide>
        ))}
      </Container>
    )
  );
};

export default MovieCarousel;
