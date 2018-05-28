'use strict'

window.ChartSetups = class {
  static barChart () {
    return {
      type: 'bar',
      data: {

        labels: [],
        datasets: [
          {
            label: 'Plats',
            data: [],
            backgroundColor: 'rgba(210,204,161,0.7)'
          }
        ]
      },
      options: {
        tooltips: {
          mode: 'nearest',
          intersect: true,
          displayColors: true,
          callbacks: {
            labelColor: function (e, j) {
              return {
                borderColor: 'white',
                backgroundColor: 'red'
              }
            }
          }
        },
        legend: {
          display: false,
          labels: {
            fontColor: '#928779',
            fontSize: 23,
            boxWidth: 0
          }
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              gridLines: {
                borderDash: [10, 5],
                color: '#DB8555',
                zeroLineColor: '#DB8555',
                lineWidth: 2,
                zeroLineWidth: 2
              },
              position: 'right',
              display: true,
              ticks: {
                fontSize: 14,
                fontColor: '#928779',
                padding: 5,
                maxTicksLimit: 5,
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              barThickness: 10,
              gridLines: {
                display: false
              },
              ticks: {
                fontSize: 20,
                maxRotation: 0,
                minRotation: 0,
                autoSkip: false
              }
            }
          ]
        }
      }
    }
  }
}
