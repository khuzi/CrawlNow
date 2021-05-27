import { useEffect } from "react";
import Router from "next/router";
import { fetchUser } from "../utils/user";


export default function Signup() {
  useEffect(async () => {
    const user = await fetchUser();
    
    if (user) {
      Router.push("/dashboard");
      return;
    }
    
    Router.push("/api/login");
  }, []);

  return null;
}
