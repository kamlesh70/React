import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, login } from "../../store/slices/userSlice";
import {
  removeExtraDetails,
  setExtraDetails,
} from "../../store/slices/authSlice";
import { IncreaseReducerActionTypes } from "../../types";

const reducerFunction = (state: any, action: any) => {
  if (action?.type == IncreaseReducerActionTypes.INCREASE) {
    return {
      ...state,
      count: action?.increaseBy
        ? state.count + action.increaseBy
        : state.count + 1,
    };
  } else if (action?.type == IncreaseReducerActionTypes.DECREASE) {
    return {
      ...state,
      count: Math.max(state.count - 1, 0),
    };
  }
};

function Home() {
  const [counter, dispatchCounter] = useReducer(reducerFunction, { count: 0 });
  const user = useSelector((state: any) => state.userList);
  const extraDetails = useSelector((state: any) => state.auth.extraDetails);
  const dispatch = useDispatch();
  const inputRef = useRef<any>();

  console.log(user, extraDetails, "isLoggedIn");
  useEffect(() => {
    dispatch(login());
    dispatch(fetchUser());
  }, []);
  return (
    <>
      <div>Home</div>
      <div>
        <text>testing 1</text>
        <text>testing 2</text>
      </div>
      <InputComponent ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button
        onClick={() => {
          inputRef.current && inputRef.current?.clear();
        }}
      >
        Clear Input
      </button>
      <h2>{JSON.stringify(extraDetails)}</h2>
      <h2>{counter?.count}</h2>
      <button
        onClick={() =>
          dispatchCounter({
            type: IncreaseReducerActionTypes.INCREASE,
            increaseBy: 5,
          })
        }
      >
        Increase
      </button>
      <button
        onClick={() =>
          dispatchCounter({ type: IncreaseReducerActionTypes.DECREASE })
        }
      >
        decrease
      </button>
      <button onClick={() => dispatch(setExtraDetails())}>
        setExtraDetails
      </button>
      <button onClick={() => dispatch(removeExtraDetails())}>
        removeExtraDetails
      </button>
    </>
  );
}

const InputComponentForwordRef = forwardRef((_: any, ref: any) => {
  return <input placeholder="Please enter your name" ref={ref} />;
});

const InputComponent = ({ ref }: any) => {
  const inputRef = useRef<any>();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = "";
    },
  }));

  return <input ref={inputRef} placeholder="Pease enter your name" />;
};

export default Home;
