// eslint-disable-next-line react/prop-types
const AlertCard = ({ message, type, date }) => {
  const cardStyle = {
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    backgroundColor: type === 'error' ? '#ffebee' : type === 'warning' ? '#fffde7' : '#e3f2fd',
    border: `1px solid ${type === 'error' ? '#ef9a9a' : type === 'warning' ? '#ffee58' : '#90caf9'}`,
    color: '#333',
  };

  const messageStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
  };

  const dateStyle = {
    fontSize: '0.8em',
    color: '#666',
  };

  return (
    <div style={cardStyle}>
      <div style={messageStyle}>{message}</div>
      <div style={dateStyle}>Type: {type} | Date: {date}</div>
    </div>
  );
};

export default AlertCard;
