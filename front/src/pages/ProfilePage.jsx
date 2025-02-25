import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProfileData } from '../utils/profileApi';
import { setProfileInfo } from '../stores/profile';

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

  return <div></div>;
};

export default ProfilePage;
