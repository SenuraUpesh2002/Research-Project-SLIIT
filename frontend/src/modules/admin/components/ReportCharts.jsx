/* eslint-disable react/prop-types */
const ReportCharts = ({ data, chartType, dataKey, nameKey }) => {
  const chartContainerStyle = {
    width: '100%',
    height: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    border: '1px solid #eee',
    color: '#777',
    fontSize: '1.2em',
  };

  if (!data || data.length === 0) {
    return <div style={chartContainerStyle}>No data available for this chart.</div>;
  }

  return (
    <div style={chartContainerStyle}>
      {/* 
        In a real application, you would integrate a charting library here,
        e.g., Recharts, Chart.js, Nivo, etc.
        
        Example with mock data display:
      */}
      <p>Displaying a {chartType} chart for {dataKey} by {nameKey}.</p>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item[nameKey]}: {item[dataKey]}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReportCharts;
