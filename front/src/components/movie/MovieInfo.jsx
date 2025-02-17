import styled from 'styled-components';
import Url from '../../constants/URL';
import { Star } from 'lucide-react';
import tw from 'tailwind-styled-components';

const FlexRowContainer = tw.div`
  flex text-base items-center
`;

const Title = tw.p`
  font-pretendard_semibold text-lg mr-4
`;

const ImageBox = styled.div`
  display: block;
  width: 25%;
  aspect-ratio: 1 / 1;
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
            <p className="text-sm">{data.vote_average}</p>
          </div>
        </FlexRowContainer>
        <FlexRowContainer>
          <Title>상영일</Title>
          <p>{data.release_date}</p>
        </FlexRowContainer>
        <FlexRowContainer>
          <Title>장르</Title>
        </FlexRowContainer>
        <FlexRowContainer>
          <Title>감독</Title>
          <p>{data.director}</p>
        </FlexRowContainer>
        <div className="flex flex-col gap-2">
          <Title>영화 줄거리</Title>
          <p>{data.overview}</p>
        </div>
      </div>
      <ImageBox>
        {/* <img
          className="w-full h-full"
          alt="poster"
          src={Url.tmdbImgPath + data.poster_path}
        /> */}
      </ImageBox>
    </div>
  );
};

export default MovieInfo;
