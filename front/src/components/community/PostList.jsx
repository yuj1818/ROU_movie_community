import { Fragment, useEffect, useState } from 'react';
import { getPostData } from '../../utils/communityApi';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setSort, setTotalPages } from '../../stores/community';
import PostInfo from '../common/post/PostInfo';
import { Line } from '../common/Line';
import Pagination from '../common/Pagination';
import Colors from '../../constants/Colors';

const PostList = () => {
  const { page, sort, totalPages } = useSelector((state) => state.community);
  const dispatch = useDispatch();
  const [postList, setPostList] = useState([]);

  const getPostList = async () => {
    const res = await getPostData({
      page: page,
      sort: sort,
    });
    dispatch(setTotalPages(res.total_pages));
    setPostList(res.results);
  };

  const onPageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  useEffect(() => {
    getPostList();
  }, [page, sort]);

  return (
    <div className="flex flex-col w-full gap-4">
      <select
        className="text-black w-fit self-end text-sm h-[1.5rem] rounded-sm"
        name="sort"
        id="sort-select"
        value={sort}
        onChange={(e) => dispatch(setSort(parseInt(e.target.value)))}
      >
        <option value={0}>최신순</option>
        <option value={1}>좋아요 ↓</option>
        <option value={2}>댓글 ↓</option>
      </select>
      {postList &&
        postList.map((post, idx) => (
          <Fragment key={post.id}>
            <PostInfo data={post} />
            {idx !== postList.length - 1 && <Line />}
          </Fragment>
        ))}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        color={Colors.btnPurple}
      />
    </div>
  );
};

export default PostList;
