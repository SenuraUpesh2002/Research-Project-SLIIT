import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

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

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return <div style={chartContainerStyle}>Unsupported chart type.</div>;
    }
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      {renderChart()}
    </div>
  );
};

export default ReportCharts;
