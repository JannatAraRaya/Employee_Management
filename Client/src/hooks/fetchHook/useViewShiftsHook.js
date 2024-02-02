import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
const useFetchShiftHook = () => {
  const [data, setData] = useState([]);

  const fetchShifts = () => {
    axiosInstance
      .post("shift/search")
      .then((resp) => {
        console.log("Response Data:", resp.data);
        setData([...data, resp.data]);
        resp.data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return { data, setData, fetchShifts };
};

export default useFetchShiftHook;
