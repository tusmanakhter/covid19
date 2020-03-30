import React from 'react'
import PropTypes from 'prop-types'
import { EuiButton } from '@elastic/eui';

const BackButton = ({ data, onBack }) => {
  let backKey = '';
  
  if (data.location.province !== '') {
    backKey = data.location.country;
  } else {
    backKey = 'Global'
  }

  if (backKey) {
    return (
      <>
        <EuiButton fill iconType="arrowLeft" fullWidth onClick={() => onBack(backKey)} aria-label="Back">
          Return to {backKey}
        </EuiButton>
      </>
    )
  }
  return(null)
}

BackButton.propTypes = {
  data: PropTypes.object,
  onBack: PropTypes.func,
}

export default BackButton;
