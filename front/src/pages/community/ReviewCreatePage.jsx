import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReviewCreationForm from '../../components/community/ReviewCreationForm';

const ReviewCreatePage = () => {
  return (
    <div className="grow flex justify-center">
      <ReviewCreationForm />
    </div>
  );
};

export default ReviewCreatePage;
