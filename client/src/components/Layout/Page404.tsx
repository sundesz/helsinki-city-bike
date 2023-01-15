import { useNavigate } from 'react-router-dom';

const Page404 = () => {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate('/');
    // navigate(-1);
  };

  return (
    <>
      <div className="page-404">Page not found</div>
      <div className="go-back" onClick={goBackHandler}>
        Back to homepage
      </div>
    </>
  );
};

export default Page404;
