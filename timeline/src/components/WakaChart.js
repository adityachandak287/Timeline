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
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0],
          formatter: function(val, opts) {
            const minutes = Math.round((val % 1) * 60);
            return val > 0
              ? parseInt(val) + ":" + (minutes < 10 ? "0" + minutes : minutes)
              : "";
          },
          style: {
            colors: ["#000"]
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
        fill: {
          colors: [
            function({ value, seriesIndex, w }) {
              if (value < 1) {
                return "#D3212D";
              } else if (value < 2) {
                return "#FF7E00";
              } else if (value < 4) {
                return "#FFBF00";
              } else if (value < 6) {
                return "#84DE02";
              } else {
                return "#3B7A57";
              }
            }
          ]
        },
        // colors: ["#F78800"],
        // theme: {
        //   mode: "light",
        //   palette: "palette1"
        // },
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
    const url = "http://localhost:8080/waka";
    const jsonData = await fetch(url);
    const wakaData = await jsonData.json();
    console.log(wakaData);
    let seriesData = [];
    let dates = [];
    wakaData.wakaStats.forEach(day => {
      if (!day.waka) console.log(day);
      if (day.waka.grand_total.total_seconds > 0) {
        let temp = day.waka.grand_total.hours;
        temp += day.waka.grand_total.minutes / 60.0;
        seriesData.push(temp.toFixed(2));
        dates.push(day.waka.range.date);
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
          type="bar"
          width="100%"
          height="400px"
        />
      </div>
    );
  }
}

export default WakaChart;
