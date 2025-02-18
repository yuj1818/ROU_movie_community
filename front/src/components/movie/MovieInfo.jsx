import styled from 'styled-components';
import Url from '../../constants/URL';
import { Star, TvMinimal, ThumbsUp, ThumbsDown } from 'lucide-react';
import Youtube from '../../assets/youtube.svg?react';
import tw from 'tailwind-styled-components';
import { useSelector } from 'react-redux';

const FlexRowContainer = tw.div`
  flex text-base items-center
`;

const Title = tw.p`
  font-pretendard_semibold text-lg mr-4
`;

const Content = tw.p`
  font-pretendard_exlight
`;

const MovieInfo = () => {
  const { movieInfo } = useSelector((state) => state.movie);

  return (
    <div className="flex w-full max-h-min">
      <div className="flex flex-col w-3/4 gap-4 pr-8">
        <FlexRowContainer>
          <Title className="text-2xl w-fit">{movieInfo.title}</Title>
          <div className="flex gap-1 items-center">
            <Star className="w-4 h-4" fill="yellow" />
            <Content className="text-sm">{movieInfo.vote_average}</Content>
          </div>
        </FlexRowContainer>
        <FlexRowContainer>
          <Title>상영일</Title>
          <Content>{movieInfo.release_date}</Content>
        </FlexRowContainer>
        <FlexRowContainer>
          <Title>장르</Title>
        </FlexRowContainer>
        <FlexRowContainer>
          <Title>감독</Title>
          <Content>{movieInfo.director}</Content>
        </FlexRowContainer>
        <div className="flex flex-col gap-2">
          <Title>영화 줄거리</Title>
          <Content>{movieInfo.overview}</Content>
        </div>
        <div className="flex gap-4 h-[1.5rem]">
          <TvMinimal color={movieInfo.isWatch ? 'red' : 'white'} />
          <ThumbsUp fill={movieInfo.isLike ? 'white' : 'none'} color="white" />
          <ThumbsDown
            fill={movieInfo.isDislike ? 'white' : 'none'}
            color="white"
          />
          <Star fill={movieInfo.isFavorite ? 'yellow' : 'none'} color="white" />
          <Youtube height="1.5rem" width="2rem" />
        </div>
      </div>
      <div className="w-1/4">
        <div className="w-full aspect-3/4">
          <img
            className="w-full h-full"
            alt="poster"
            src={Url.tmdbImgPath + movieInfo.poster_path}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
