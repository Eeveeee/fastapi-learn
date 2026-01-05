import { useEffect, type PropsWithChildren } from "react";
import { initCurrentUser } from "../store/authThunks";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Loader } from "lucide-react";

export function InitProvider(props: PropsWithChildren) {
  const dispatch = useAppDispatch();

  const initStatus = useAppSelector((state) => state.auth.initStatus);
  useEffect(() => {
    dispatch(initCurrentUser());
  }, [dispatch]);

  if (initStatus === "idle" || initStatus === "loading") {
    return <Loader />;
  }

  return props.children;
}
