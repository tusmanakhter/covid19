import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { EuiDatePicker, EuiRange } from '@elastic/eui';
import { useDebounce } from 'use-debounce';
import moment from 'moment-timezone';

const today = moment.tz('Etc/GMT').format("M/D/YY");
const todayMoment = moment(today);

const getDates = () => {
  const start = moment("1/22/2020");
  const end = todayMoment;

  const days = []
  let current = start;
  while (current.isSameOrBefore(end)) {
    days.push(current);
    current = current.clone().add(1, 'days');
  }
  return days;
}

const dates = getDates();
const max = dates.length - 1;

const DatePicker = ({ setDisplayDate, data }) => {
  const minDate = moment("1/22/2020");
  const maxDate = todayMoment;

  const [selectedDate, setSelectedDate] = useState(maxDate);
  const [value, setValue] = useState(max);
  const [debouncedSelectedDate] = useDebounce(selectedDate, 150)
  
  const handleChange = date => {
    const dateIndex = dates.findIndex(day =>  day.isSame(date, 'day'));

    if (date.isBefore(minDate)) {
      date = moment(minDate)
    }

    if (date.isAfter(maxDate)) {
      date = maxDate;
    }

    setSelectedDate(date);
    setDisplayDate(date);
    setValue(dateIndex);
  };

  const onChange = e => {
    const dateIndex = e.target.value;
    setValue(dateIndex);
    setSelectedDate(dates[dateIndex]);
  };

  useEffect(() => {
    if (data) {
      setDisplayDate(debouncedSelectedDate);
    }
  }, [debouncedSelectedDate, data, setDisplayDate]);

  return (
    <div>
      <EuiDatePicker selected={selectedDate} minDate={minDate} maxDate={maxDate} onChange={handleChange} fullWidth />
      <EuiRange min={0} max={max} value={value} showRange onChange={onChange} fullWidth compressed />
    </div>
  )
}

DatePicker.propTypes = {
  setDisplayDate: PropTypes.func,
  data: PropTypes.object,
}

export default DatePicker;
