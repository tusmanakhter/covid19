import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { EuiDatePicker } from '@elastic/eui';
import moment from 'moment';

const DatePicker = ({ setDisplayDate }) => {
  const minDate = moment("1/22/2020");
  const maxDate = moment();
  const [selectedDate, setSelectedDate] = useState(maxDate);

  const handleChange = date => {
    if (date.isBefore(minDate)) {
      date = moment(minDate)
    }

    if (date.isAfter(maxDate)) {
      date = maxDate;
    }

    setSelectedDate(date);
    setDisplayDate(date);
  };

  return (
    <EuiDatePicker selected={selectedDate} minDate={minDate} maxDate={maxDate} onChange={handleChange} fullWidth/>
  )
}

DatePicker.propTypes = {
  setDisplayDate: PropTypes.func,
}

export default DatePicker;
