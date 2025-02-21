import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '../common/Badge';
import Colors from '../../constants/Colors';
import { CircleX, CircleChevronRight } from 'lucide-react';
import { selectTag, toggleTag } from '../../stores/home';

const TagList = () => {
  const dispatch = useDispatch();
  const { selectedTag, isTagOpen, tags } = useSelector((state) => state.home);
  return (
    <div className="w-11/12 flex flex-wrap gap-2 items-center">
      {isTagOpen
        ? tags.map((tag) => (
            <Badge
              key={tag.id}
              $isPointer={true}
              $background={
                tag.id === selectedTag ? Colors.btnBlue : Colors.btnGray
              }
              $fontSize={0.875}
              $paddingY={0.1}
              onClick={() => dispatch(selectTag(tag.id))}
            >
              {tag.name}
            </Badge>
          ))
        : tags.slice(0, 5).map((tag) => (
            <Badge
              key={tag.id}
              $isPointer={true}
              $background={
                tag.id === selectedTag ? Colors.btnBlue : Colors.btnGray
              }
              $fontSize={0.875}
              $paddingY={0.1}
              onClick={() => dispatch(selectTag(tag.id))}
            >
              {tag.name}
            </Badge>
          ))}
      {isTagOpen ? (
        <CircleX
          className="h-4/5"
          color="white"
          onClick={() => dispatch(toggleTag())}
        />
      ) : (
        <CircleChevronRight
          className="h-4/5"
          color="white"
          onClick={() => dispatch(toggleTag())}
        />
      )}
    </div>
  );
};

export default TagList;
