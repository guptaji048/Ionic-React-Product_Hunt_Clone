import React, { useState, useEffect } from "react";
import { toast } from "../utils/toast";

export default function useFormValidation(initialState, validate, action) {
  const [values, setvalues] = useState(initialState);
  const [errors, seterrors] = useState({});
  const [isSubmitting, setisSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noError = Object.keys(errors).length === 0;
      if (noError) {
        action();
        setvalues(initialState);
        setisSubmitting(false);
      } else {
        toast(Object.values(errors).join(" "));
        setisSubmitting(false);
      }
    }
  }, [errors]);

  function handleChange(event) {
    setvalues(previousValues => ({
      ...previousValues,
      [event.target.name]: event.target.value
    }));
  }

  function handleSubmit() {
    const validationErrors = validate(values);
    seterrors(validationErrors);
    setisSubmitting(true);
  }
  return {
    handleChange,
    handleSubmit,
    values,
    setvalues,
    isSubmitting
  };
}
