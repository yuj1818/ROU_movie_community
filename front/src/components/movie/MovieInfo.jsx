import styled from 'styled-components';
import Url from '../../constants/URL';
import { Star, TvMinimal, ThumbsUp, ThumbsDown } from 'lucide-react';
import tw from 'tailwind-styled-components';

const FlexRowContainer = tw.div`
  flex text-base items-center
`;

const Title = tw.p`
  font-pretendard_semibold text-lg mr-4
`;

const Content = tw.p`
  font-pretendard_exlight
`;

const ImageBox = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: white;
`;

const MovieInfo = ({ data }) => {
  return (
    <div className="flex w-full">
      <div className="flex flex-col gap-4 w-3/4 pr-8">
        <FlexRowContainer>
          <Title className="text-2xl w-fit">{data.title}</Title>
          <div className="flex gap-1 items-center">
            <Star className="w-4 h-4" fill="yellow" />
            <Content className="text-sm">{data.vote_average}</Content>
          </div>
        </FlexRowContainer>
        <FlexRowContainer>
          <Title>상영일</Title>
          <Content>{data.release_date}</Content>
        </FlexRowContainer>
        <FlexRowContainer>
          <Title>장르</Title>
        </FlexRowContainer>
        <FlexRowContainer>
          <Title>감독</Title>
          <Content>{data.director}</Content>
        </FlexRowContainer>
        <div className="flex flex-col gap-2">
          <Title>영화 줄거리</Title>
          <Content>{data.overview}</Content>
        </div>
        <div className="flex gap-4 h=[1rem]">
          <TvMinimal color={data.isWatch ? 'red' : 'white'} />
          <ThumbsUp fill={data.isLike ? 'white' : 'none'} color="white" />
          <ThumbsDown fill={data.isDislike ? 'white' : 'none'} color="white" />
          <Star fill={data.isFavorite ? 'yellow' : 'none'} color="white" />
        </div>
      </div>
      <div className="w-1/4">
        <div className="w-full aspect-3/4 bg-white">
          <img
            className="w-full h-full"
            alt="poster"
            src={Url.tmdbImgPath + data.poster_path}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
