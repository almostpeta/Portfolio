import React, { useEffect, useState } from "react";
import makeAnimated from "react-select/animated";
import Select from "react-select";

export const MultiSelect = ({
  options,
  onChange,
  placeholder,
  values,
  isInvalid,
}) => {
  const [optionsState, setOptionsState] = useState(options);
  const [valuesState, setValuessState] = useState(values);
  const animatedComponents = makeAnimated();

  useEffect(() => {
    options && setOptionsState(options);
  }, [options]);

  useEffect(() => {
    values && setValuessState(values);
  }, [values]);

  return (
    <div>
      <Select
        closeMenuOnSelect={false}
        //the following line make the styles collapse
        // components={animatedComponents}
        isMulti
        styles={{
          control: (styles) => ({
            ...styles,
            borderColor: isInvalid ? "red" : styles.borderColor,
            "&:hover": {
              borderColor: isInvalid ? "red" : styles["&:hover"].borderColor,
            },
          }),
        }}
        options={optionsState}
        value={valuesState}
        placeholder={placeholder}
        onChange={(items) => onChange(items)}
      />
    </div>
  );
};
