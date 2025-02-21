import React, { useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Url from '../../constants/URL';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

const SortedMovieCarousel = ({ id }) => {
  const navigate = useNavigate();
  const { sortedMovies } = useSelector((state) => state.home);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    initial: 0,
    slides: {
      perView: 7.5,
      spacing: 10,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    sortedMovies[id] && (
      <div className="w-full h-fit relative flex justify-center items-center">
        <div className="w-11/12 h-fit">
          <div ref={sliderRef} className="keen-slider h-fit">
            {sortedMovies[id].map((data) => (
              <div
                key={data.movie_id}
                className="keen-slider__slide flex w-full aspect-3/4 cursor-pointer"
                onClick={() => navigate(`/movie/${data.movie_id}`)}
              >
                {data.poster_path ? (
                  <img
                    src={Url.tmdbImgPath + data.poster_path}
                    alt="poster"
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                    <ImageOff className="w-3/4" color="white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {loaded && instanceRef.current && (
          <>
            <ChevronLeft
              size="2rem"
              className="absolute left-0 top-1/2 cursor-pointer opacity-50"
              color="white"
              onClick={(e) => instanceRef.current?.prev()}
            />
            <ChevronRight
              size="2rem"
              className="absolute right-0 top-1/2 cursor-pointer opacity-50"
              color="white"
              onClick={(e) => instanceRef.current?.next()}
            />
          </>
        )}
      </div>
    )
  );
};

export default SortedMovieCarousel;
