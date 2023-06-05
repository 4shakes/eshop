import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
  const location = useLocation();
  const [error, setError] = useState(false);

  useEffect(() => {
    const sendRequest = async () => {
      const searchParams = new URLSearchParams(location.search);
      const activation_token = searchParams.get("token");

      await axios
        .post(`${server}/shop/activation`, {
          activation_token,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
    };

    const timer = setTimeout(() => {
      sendRequest();
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [location]);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>Your token is expired!</p>
      ) : (
        <p>Your account has been created suceessfully!</p>
      )}
    </div>
  );
};

export default SellerActivationPage;
