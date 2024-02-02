import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import "./CreateShift.scss";
import useCreateShiftHook from "../../../hooks/formHook/useCreateShiftHook";

const CreateShift = () => {
  const {createShift} = useCreateShiftHook();
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  const handlerOnSubmit = (data) => {
    console.log("Form Data:", data);
    createShift(data);
  };

  useEffect(() => {
    console.log("Errors: ", errors);
  }, [errors]);

  return (
    <div className="shift-container">
      <h1>Assign Shifts</h1>
      <form className="shift-container__form" onSubmit={handleSubmit(handlerOnSubmit)}>
        <div className="shift-container__left">
          <p>Assigneed To:</p>
          <Controller
            name="assigneedTo"
            control={control}
            rules={{
              required: "ID is required"
            }}
            render={({ field }) => (
              <input
                type="text"
                label="assigneedTo"
                placeholder="Employee ID"
                {...field}
                className={errors.assigneedTo ? "error" : ""}
              />
            )}
          />
          {errors.assigneedTo && <h5>{errors.assigneedTo.message}</h5>}
        </div>
        <div className="shift-container__right">
          <div>
            <p>Date:</p>
            <Controller
              name="date"
              control={control}
              rules={{
                required: "Date is required"
              }}
              render={({ field }) => (
                <input
                  type="date"
                  label="date"
                  placeholder="Date"
                  {...field}
                  dateFormat="yyyy-MM-dd"
                  className={errors.date ? "error" : ""}
                />
              )}
            />
            {errors.date && <h5>{errors.date.message}</h5>}
          </div>
 
          <div>
            <p>Shift Starts:</p>
            <Controller
              name="startTime"
              control={control}
              rules={{
                required: "Start time is required"
              }}
              render={({ field }) => (
                <input
                  type="text"
                  label="startTime"
                  placeholder="Start Time (Please define AM-PM)"
                  {...field}
                  className={errors.startTime ? "error" : ""}
                />
              )}
            />
            {errors.startTime && <h5>{errors.startTime.message}</h5>}
          </div>
          <div>
            <p>Shift Ends:</p>
            <Controller
              name="endTime"
              control={control}
              rules={{
                required: "End time is required"
              }}
              render={({ field }) => (
                <input
                  type="text"
                  label="endTime"
                  placeholder="End Time  (Please define AM-PM)"
                  {...field}
                  className={errors.endTime ? "error" : ""}
                />
              )}
            />
            {errors.endTime && <h5>{errors.endTime.message}</h5>}
          </div>
          <button className="shift-container__button" type="submit">Create</button>
        </div>

      </form>
    </div>
  );
};

export default CreateShift;
