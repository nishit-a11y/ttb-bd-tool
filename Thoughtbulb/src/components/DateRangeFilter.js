import React, { useState } from "react";
import { DatePicker, Button } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

const DateRangeFilter = ({ onFilter, value, setValue }) => {
  const handleRangeChange = (dates, dateStrings) => {
    setValue(dates);
    console.log("dates", dates, dateStrings);
    onFilter(dateStrings);
  };

  return (
    <RangePicker
      value={value}
      onChange={handleRangeChange}
      placeholder={["Start Date", "End Date"]}
      placement="bottom-right"
    />
  );
};

export default DateRangeFilter;
