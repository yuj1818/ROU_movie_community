const ReviewInfo = ({ data }) => {
  return (
    <div className="flex items-center gap-4 w-full h-[5rem] px-6 py-4 border border-solid border-gray-300 rounded-md">
      <img
        className="w-[3rem] h-[3rem] rounded-full"
        src={import.meta.env.VITE_API_URL + data.review_writor.profile_image}
        alt="user_img"
      />
      <div className="grow flex flex-col gap-2 text-black min-w-0">
        <p className="text-base overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
          {data.title}
        </p>
        <p className="text-sm font-pretendard_exlight overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
          {data.content}
        </p>
      </div>
      <div className="flex items-end h-full">
        <p className="text-xs font-pretendard_exlight text-gray-400 whitespace-nowrap">
          by. {data.review_writor.username}
        </p>
      </div>
    </div>
  );
};

export default ReviewInfo;
