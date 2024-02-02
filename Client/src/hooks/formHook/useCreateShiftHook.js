import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
const useCreateShiftHook = () => {
  const [data, setData] = useState([]);

  const createShift = (formData) => {
    console.log("The form data ", formData);
    axiosInstance
      .post("shift/create", formData)
      .then((resp) => {
        console.log("Response Data:", resp.data);
        setData([...data, resp.data]);
        resp.data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return { data, setData, createShift };
};

export default useCreateShiftHook;
