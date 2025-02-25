import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProfileData } from '../utils/profileApi';
import { setProfileInfo } from '../stores/profile';
import ProfileBox from '../components/profile/ProfileBox';

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
    <div className="w-4/5 flex gap-20 text-white py-12 h-fit">
      <ProfileBox />
    </div>
  );
};

export default ProfilePage;
