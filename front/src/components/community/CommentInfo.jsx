import { CornerDownRight } from 'lucide-react';

const CommentInfo = ({ data, depth }) => {
  return (
    <div className="grow flex flex-col text-black gap-2">
      <div className="flex gap-2">
        <span className="font-pretendard_semibold text-sm">
          {data.comment_writor.username}
        </span>
        <span className="text-sm whitespace-pre-line">{data.content}</span>
      </div>
      {data.commented &&
        data.commented.map((recomment) => (
          <div className="flex gap-2" key={recomment.id}>
            <CornerDownRight size="1rem" />
            <CommentInfo data={recomment} depth={depth + 1} />
          </div>
        ))}
    </div>
  );
};

export default CommentInfo;
