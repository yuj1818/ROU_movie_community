import styled from 'styled-components';
import Url from '../../constants/URL';
import { Star, TvMinimal, ThumbsUp, ThumbsDown } from 'lucide-react';
import Youtube from '../../assets/youtube.svg?react';
import tw from 'tailwind-styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '../common/Badge';
import { likeMovie } from '../../utils/movieApi';
import { toggleLikeMovie } from '../../stores/movie';

const FlexRowContainer = tw.div`
  flex text-base items-center
`;

const Title = tw.p`
  font-pretendard_semibold text-lg mr-4
`;

const Content = tw.p`
  font-pretendard_exlight
`;

const Line = tw.hr`
  border-t border-solid border-gray-700 w-full
`;

const IconContainer = tw.div`
  h-full flex items-center text-sm text-white font-pretendard_exlight gap-1
`;

const MovieInfo = () => {
  const { movieInfo } = useSelector((state) => state.movie);
  const dispatch = useDispatch();

  const onClickLike = async () => {
    const res = await likeMovie(movieInfo.movie_id);
    dispatch(toggleLikeMovie(res.like_movie_users_count));
  };

  return (
    <div className="flex w-full max-h-min">
      <div className="flex flex-col w-3/4 gap-4 pr-8">
        <div className="flex text-base items-end">
          <Title className="text-2xl w-fit">{movieInfo.title}</Title>
          <div className="flex gap-1 items-center">
            <Star className="w-4 h-4" fill="yellow" />
            <Content className="text-sm">{movieInfo.vote_average}</Content>
          </div>
        </div>
        <Line />
        <FlexRowContainer>
          <Title>상영일</Title>
          <Content>{movieInfo.release_date}</Content>
        </FlexRowContainer>
        <FlexRowContainer>
          <Title>장르</Title>
          <div className="flex gap-1">
            {movieInfo.genres.map((genre) => (
              <Badge key={genre.id}>{genre.name}</Badge>
            ))}
          </div>
        </FlexRowContainer>
        <FlexRowContainer>
          <Title>감독</Title>
          <Content>{movieInfo.director}</Content>
        </FlexRowContainer>
        <div className="flex">
          <Content>{movieInfo.overview}</Content>
        </div>
        <Line />
        <div className="flex gap-4 h-[1.5rem]">
          <TvMinimal
            className="cursor-pointer"
            color={movieInfo.isWatch ? 'red' : 'white'}
          />
          <IconContainer>
            <ThumbsUp
              className="h-full cursor-pointer"
              fill={movieInfo.isLike ? 'white' : 'none'}
              color="white"
              onClick={onClickLike}
            />
            <p>{movieInfo.like_movie_users_count}</p>
          </IconContainer>
          <IconContainer>
            <ThumbsDown
              className="h-full cursor-pointer"
              fill={movieInfo.isDislike ? 'white' : 'none'}
              color="white"
            />
            <p>{movieInfo.dislike_movie_users_count}</p>
          </IconContainer>
          <IconContainer>
            <Star
              className="h-full cursor-pointer"
              fill={movieInfo.isFavorite ? 'yellow' : 'none'}
              color="white"
            />
            <p>{movieInfo.favorite_movie_users_count}</p>
          </IconContainer>
          <Youtube className="cursor-pointer" height="1.5rem" width="2rem" />
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
