import { useEffect, type PropsWithChildren } from "react";
import { initCurrentUser } from "../store/authThunks";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Loader } from "lucide-react";

export function InitProvider(props: PropsWithChildren) {
  const dispatch = useAppDispatch();

  const isAuth = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    dispatch(initCurrentUser());
  }, [dispatch]);

  if (!isAuth) {
    return <Loader />;
  }

  return props.children;
}
