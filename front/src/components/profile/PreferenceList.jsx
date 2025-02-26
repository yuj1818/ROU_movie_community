import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '../common/Badge';
import tw from 'tailwind-styled-components';
import Colors from '../../constants/Colors';
import { openModal } from '../../stores/modal';

const Container = tw.div`
  flex flex-col gap-2 w-full items-center
`;

const Title = tw.p`
  font-pretendard_semibold
`;

const GenreContainer = tw.div`
  flex gap-1 flex-wrap justify-center
`;

const PreferenceList = () => {
  const { like_genres, hate_genres } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-2 pb-6 border border-solid border-white rounded-md">
      <Container>
        <span
          className="text-xs font-pretendard_exlight self-end underline underline-offset-2 cursor-pointer"
          onClick={() => dispatch(openModal('genre'))}
        >
          편집
        </span>
        <Title>관심 있는 장르</Title>
        <GenreContainer>
          {like_genres.length ? (
            like_genres.map((genre) => (
              <Badge key={genre.id} $fontSize={0.875}>
                {genre.name}
              </Badge>
            ))
          ) : (
            <p className="text-white text-xs">없음</p>
          )}
        </GenreContainer>
      </Container>
      <Container>
        <Title>관심 없는 장르</Title>
        <GenreContainer>
          {hate_genres.length ? (
            hate_genres.map((genre) => (
              <Badge
                key={genre.id}
                $fontSize={0.875}
                $background={Colors.btnGray}
              >
                {genre.name}
              </Badge>
            ))
          ) : (
            <p className="text-white text-xs">없음</p>
          )}
        </GenreContainer>
      </Container>
    </div>
  );
};

export default PreferenceList;
