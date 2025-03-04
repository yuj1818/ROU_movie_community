import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createComment, getCommentData } from '../../utils/communityApi';
import { setComments } from '../../stores/community';
import { Line } from '../common/Line';
import CommentInfo from './CommentInfo';
import { Button } from '../common/Button';
import Colors from '../../constants/Colors';
import { CommentTextArea } from './CommentTextArea';

const CommentList = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.community);
  const [commentContent, setCommentContent] = useState('');

  const onSubmitComment = async () => {
    const res = await createComment(params.review_id, {
      content: commentContent,
    });
    dispatch(setComments(res.reply_comments));
    setCommentContent('');
  };

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
        <div className="w-full px-2 flex flex-col gap-2">
          {comments.map((comment) => (
            <CommentInfo key={comment.id} data={comment} depth={0} />
          ))}
        </div>
        <div className="flex gap-2 mt-2 px-2">
          <CommentTextArea
            rows={3}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <Button
            $marginTop={0}
            $background={Colors.btnPurple}
            disabled={commentContent.trim().length === 0}
            onClick={onSubmitComment}
          >
            댓글 작성
          </Button>
        </div>
      </div>
    )
  );
};

export default CommentList;
