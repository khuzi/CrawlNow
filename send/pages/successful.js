import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@material-ui/core";
import classes from "../styles/successful.module.css";

export default function Successful() {
  const paidFile =
    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("paidFile"));

  const router = useRouter();

  if (!paidFile) {
    useEffect(() => {
      router.push("/dashboard");
    }, []);

    return null;
  }

  return (
    <div className={classes.successful}>
      <div className={classes.title_msg}>
        <h1>Payment Successful</h1>
        <p>
          Thank you! ${paidFile?.price} successfully charged to your credit card
        </p>
      </div>
      <div className={classes.green_mark}>
        <img src="/images/green-mark.jpg" />
      </div>
      <div className={classes.btns}>
        <Button>
          <a href={`https://sftp-api.herokuapp.com/download/${paidFile.name}`}>
            Download
          </a>
        </Button>
        <Button>
          <Link href="/dashboard">
            <a>Go To Dashboard</a>
          </Link>
        </Button>
      </div>
    </div>
  );
}
