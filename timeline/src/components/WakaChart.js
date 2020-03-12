import React from "react";
import Chart from "react-apexcharts";

class WakaChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "series1",
          data: []
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
          // background: "#333333"
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: undefined,
          formatter: function(val, opts) {
            const minutes = parseInt((val % 1) * 60);
            return val > 0
              ? parseInt(val) + ":" + (minutes < 10 ? "0" + minutes : minutes)
              : "";
          }
        },
        title: {
          text: "WakaTime Coding Statistics",
          align: "center",
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "24px",
            fontWeight: "bold",
            fontFamily: undefined,
            color: "#263238"
          }
        },
        markers: {
          size: 5
        },
        stroke: {
          curve: "straight"
        },
        theme: {
          mode: "light",
          palette: "palette1"
        },
        xaxis: {
          type: "datetime",
          categories: []
        },
        tooltip: {
          enabled: true,
          x: {
            format: "dd/MM/yy HH:mm"
          }
        }
      }
    };
  }

  async componentDidMount() {
    const jsonData = await fetch("http://localhost:8080/waka");
    const wakaData = await jsonData.json();
    console.log(wakaData);
    let seriesData = [];
    let dates = [];
    wakaData.wakaStats.forEach(day => {
      if (day.grand_total.total_seconds > 0) {
        let temp = day.grand_total.hours;
        temp += day.grand_total.minutes / 60.0;
        seriesData.push(temp.toFixed(2));
        dates.push(day.range.date);
      }
    });

    this.setState({
      series: [
        {
          name: "Hours coded",
          data: seriesData
        }
      ],
      options: {
        ...this.state.options,
        xaxis: {
          type: "datetime",
          categories: dates
        }
      }
    });
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

export default WakaChart;
