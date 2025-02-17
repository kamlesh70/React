import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchUser, login } from "../../store/slices/userSlice";
import {
  loginUser,
  logout,
  removeExtraDetails,
  setExtraDetails,
} from "../../store/slices/authSlice";

function Home() {
  const user = useSelector((state: any) => state.userList);
  const extraDetails = useSelector((state: any) => state.auth.extraDetails);
  const dispatch = useDispatch();
  console.log(user, extraDetails, "isLoggedIn");
  useEffect(() => {
    dispatch(login());
    dispatch(fetchUser());
  }, []);
  return (
    <>
      <div>Home</div>
      <h2>{JSON.stringify(extraDetails)}</h2>
      <button onClick={() => dispatch(setExtraDetails())}>
        setExtraDetails
      </button>
      <button onClick={() => dispatch(removeExtraDetails())}>
        removeExtraDetails
      </button>
    </>
  );
}

export default Home