import React, { Component } from "react";
import Chart from "chart.js";

class Result extends Component {
  chartRef = React.createRef();
  state = {
    labels: []
  }

  componentDidUpdate() {
    const myChartRef = this.chartRef.current.getContext("2d");
    const {expenseArray, expenseAmountArray, expenseCat} = this.props
    new Chart(myChartRef, {
      type: "horizontalBar",
      data: {
        //Bring in data
        labels: this.consolidateTrans().map((c) => { return c.split(': ')[0] }),
        datasets: [
          {
            label: "Expense Result",
            data: this.consolidateTrans().map((c) => {return c.split(': ')[1]}),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ],
      },
      options: {
        //Customize chart options
        legend: {
          labels: {
            fontSize: 22
          }
        },
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontSize: 22
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                fontSize: 22
              }
            }
          ]
        }
      }
    });
  }

  handleSubtotal = (array) => {
    return array.reduce((a, b) =>
      parseFloat(a) + parseFloat(b), 0
    ).toFixed(2)
  }

  handleTotal = () => {
    const arr1 = this.handleSubtotal(this.props.incomeAmountArray);
    const arr2 = this.handleSubtotal(this.props.expenseAmountArray);
    return (arr1 - arr2).toFixed(2)
  }

  consolidateTrans = () => {
    const consolidateCat =
    this.props.expenseArray.reduce((acc, trans) => {
      acc[trans.categories] = [...acc[trans.categories] || [], trans];
      return acc;
      }, {});

      return Object.keys(consolidateCat).map((category) => {
        if (consolidateCat[category] === undefined) {
            return
          } else {
            const consolidateTotal = consolidateCat[category].reduce((accTotal, trans) => {
              accTotal += parseFloat(trans.amount)
              return accTotal;
            }, 0)
            return `${category}: ${consolidateTotal}`;
          }
      })
    }
    
  render() {
    return (
      <div>
        {this.handleTotal() >= 0 ?

          <h3 className="colorPositive"> Balance: $ {this.handleTotal()} </h3>

          :

        <h3 className="colorNegative"> Balance: $ {this.handleTotal()} </h3>}
        <canvas
          id="myChart"
          ref={this.chartRef}
      />
      </div>
    )
  }
}

export default Result