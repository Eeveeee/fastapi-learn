import { useEffect, type PropsWithChildren } from "react";
import { initCurrentUser } from "../store/authThunks";
import { useAppDispatch } from "../store/hooks";

export function InitProvider(props: PropsWithChildren) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initCurrentUser());
  }, [dispatch]);
  return props.children;
}
