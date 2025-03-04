import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCommentData } from '../../utils/communityApi';
import { setComments } from '../../stores/community';
import { Line } from '../common/Line';

const CommentList = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.community);

  const getComments = async () => {
    const res = await getCommentData(params.review_id);
    dispatch(setComments(res.reply_comments));
  };

  useEffect(() => {
    getComments();
  }, [params.review_id]);

  return (
    comments !== null && (
      <div className="w-full flex flex-col gap-2">
        <p className="font-pretendard_semibold">{`댓글(${comments.length})`}</p>
        <Line />
        {comments.map((comment) => (
          <div key={comment.id}>{comment.content}</div>
        ))}
      </div>
    )
  );
};

export default CommentList;
