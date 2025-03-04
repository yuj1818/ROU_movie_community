import { CornerDownRight, Pencil, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { CommentTextArea } from './CommentTextArea';
import { Button } from '../common/Button';
import Colors from '../../constants/Colors';
import { useDispatch } from 'react-redux';
import { createRecomment } from '../../utils/communityApi';
import { useParams } from 'react-router-dom';
import {
  setComments,
  setConfirmType,
  setSelectedCommentId,
} from '../../stores/community';
import tw from 'tailwind-styled-components';
import { getCookie } from '../../utils/cookie';
import { openModal } from '../../stores/modal';

const CommentInfo = ({ data, depth }) => {
  const [isReply, setIsReply] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const dispatch = useDispatch();
  const params = useParams();

  const onSubmitRecomment = async () => {
    const res = await createRecomment(params.review_id, data.id, {
      content: commentContent,
    });
    dispatch(setComments(res.reply_comments));
    setIsReply(false);
    setCommentContent('');
  };

  return (
    <div className="grow flex flex-col text-black gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="font-pretendard_semibold text-sm">
              {data.comment_writor.username}
            </span>
            <span className="text-xs text-gray-500">
              {dayjs(data.created_at).fromNow()}
            </span>
          </div>
          <div className="flex gap-1">
            {data.comment_writor.id == getCookie('userId') && (
              <>
                <Trash2
                  className="cursor-pointer"
                  size="1rem"
                  color={Colors.btnGray}
                  onClick={() => {
                    dispatch(setConfirmType('comment'));
                    dispatch(setSelectedCommentId(data.id));
                    dispatch(openModal('delete'));
                  }}
                />
                <Pencil
                  className="cursor-pointer"
                  size="1rem"
                  color={Colors.btnGray}
                />
              </>
            )}
            <span
              className="text-xs text-gray-500 underline underline-offset-2 cursor-pointer"
              onClick={() => {
                if (isReply) {
                  setCommentContent('');
                }
                setIsReply((pre) => !pre);
              }}
            >
              {isReply ? '닫기' : '답변'}
            </span>
          </div>
        </div>
        <span className="text-sm whitespace-pre-line">{data.content}</span>
      </div>
      {isReply && (
        <div className="flex gap-2">
          <CornerDownRight size="1rem" color={Colors.btnLightGray} />
          <CommentTextArea
            rows={2}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <Button
            $marginTop={0}
            $background={Colors.btnPurple}
            disabled={commentContent.trim().length === 0}
            onClick={onSubmitRecomment}
          >
            답변 작성
          </Button>
        </div>
      )}
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
