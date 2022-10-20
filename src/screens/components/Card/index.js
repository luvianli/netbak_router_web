import React from 'react';
import PropTypes from 'prop-types';
import './index.less'
/*const stylecard = {

  backgroundColor: '#fff',
  marginBottom: '.5rem',
  WebkitBoxShadow: '0 1Px 4px 0 #dedede',
  boxShadow: '0 1Px 4px 0 #dedede',
}
const stylecardheader={

  padding: '8px 15px',
  //backgroundColor: '#e2f3ffbd'
  backgroundColor: '#e8e8e8bd'
}*/
function Card(props) {
  const { label,height } = props;
  
const styleelement={
  minHeight:height||'auto',
}
  return (    
    <div>
    <div className='card'>
      <div className="card-header">
        <h3>{label}</h3>
      </div>
      <div style={styleelement} className="content">
      {
          props.children
      }
      </div>
    </div>
  </div>
  );
}

Card.propTypes = {
  label: PropTypes.string,

};

export default Card;