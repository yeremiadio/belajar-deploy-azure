import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/utils/configs/route";

import { deleteAllCookies } from "@/services/cookie";

import useClearAllReduxCache from "./useClearAllReduxCache";

export default function useLogout() {
  const [loading, setLoading] = useState(false);
  const clearReduxCache = useClearAllReduxCache();
  const navigate = useNavigate();
  const logout = () => {
    setLoading(true);
    deleteAllCookies();
    navigate(ROUTES.login, { replace: true });
    clearReduxCache();
    setLoading(false);
  };

  return { logout, loading };
}
