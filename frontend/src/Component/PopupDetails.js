import * as React from 'react';
function PopupDetails(props) {
  const { confidence, address } = props;
  return (
    <div>
      <h3>Confidence level of Forest Fire Occurance at {address}: {confidence}%</h3>
    </div>
  );
}
export default React.memo(PopupDetails);

