import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProfileData } from '../utils/profileApi';
import { setProfileInfo } from '../stores/profile';
import ProfileBox from '../components/profile/ProfileBox';
import MovieList from '../components/profile/MovieList';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    const getProfileInfo = async () => {
      const res = await getProfileData(params.user_id);
      dispatch(setProfileInfo(res));
    };

    getProfileInfo();
  }, [params.user_id]);

  return (
    <div className="w-5/6 flex justify-around text-white py-8 h-full items-center">
      <ProfileBox />
      <MovieList />
    </div>
  );
};

export default ProfilePage;
