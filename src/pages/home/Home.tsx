import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { login } from "../../store/slices/userSlice";

function Home() {
  const user = useSelector((state: any) => state.userList);
  const dispatch = useDispatch();
  console.log(user);
  useEffect(() => {
    dispatch(login());
  }, [])
  return (
    <div>Home</div>
  )
}

export default Home