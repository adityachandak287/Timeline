import React from "react";
import Chart from "react-apexcharts";

class ChartTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100, 31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41, 11, 32, 45, 32, 34, 52, 41]
        }
      ],
      options: {
        chart: {
          height: 350,
          type: "area",
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: false
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 5
        },
        stroke: {
          curve: "straight"
        },
        theme: {
          palette: "palette1" // upto palette10
        },
        xaxis: {
          type: "datetime",
          categories: [
            "2018-01-19T00:00:00.000Z",
            "2018-02-20T01:30:00.000Z",
            "2018-03-21T02:30:00.000Z",
            "2018-04-23T03:30:00.000Z",
            "2018-05-29T04:30:00.000Z",
            "2018-11-30T05:30:00.000Z",
            "2018-12-31T06:30:00.000Z",
            "2019-01-19T00:00:00.000Z",
            "2019-02-20T01:30:00.000Z",
            "2019-03-21T02:30:00.000Z",
            "2019-04-23T03:30:00.000Z",
            "2019-05-29T04:30:00.000Z",
            "2019-11-30T05:30:00.000Z",
            "2019-12-31T06:30:00.000Z"
          ]
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm"
          }
        }
      }
    };
  }

  render() {
    return (
      <div className="chartDiv">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="line"
          width="100%"
          height="400px"
        />
      </div>
    );
  }
}

export default ChartTest;
