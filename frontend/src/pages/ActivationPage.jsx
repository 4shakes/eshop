import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
  const location = useLocation();
  const [error, setError] = useState(false);

  useEffect(() => {
    const activationEmail = async () => {
      const searchParams = new URLSearchParams(location.search);
      const activation_token = searchParams.get("token");

      try {
        const response = await axios.post(`${server}/user/activation`, {
          activation_token,
        });

        console.log(response);
      } catch (error) {
        setError(true);
        console.log(error);
      }
    };

    activationEmail();
  }, [location.search]);
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

export default ActivationPage;
