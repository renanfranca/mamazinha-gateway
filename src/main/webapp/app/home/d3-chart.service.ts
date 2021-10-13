/**
 * ChartService to define the chart config for D3
 */
export class D3ChartService {
  static getChartConfig(dayOfWeek: any): any {
    return {
      chart: {
        type: 'lineChart',
        height: 300,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55,
        },
        x(d: any): unknown {
          return d.x;
        },
        y(d: any): unknown {
          return d.y;
        },
        showValues: false,
        // valueFormat(d: any): unknown {
        //   return d3.format(',.4f')(d);
        // },
        useInteractiveGuideline: true,
        dispatch: {},
        xAxis: {
          axisLabel: 'Semanas',
          axisLabelDistance: 3,
          showMaxMin: false,
          tickFormat(d: any): any {
            if (d === 1) {
              return dayOfWeek.monday;
              // return 'Monday';
            }
            if (d === 2) {
              return 'Tuesday';
            }
            if (d === 3) {
              return 'Wednesday';
            }
            if (d === 4) {
              return 'Thusday';
            }
            if (d === 5) {
              return 'Friday';
            }
            if (d === 6) {
              return 'Saturday';
            }
            return 'Sunday';
          },
        },
        xDomain: [1, 7],
        yAxis: {
          axisLabel: '',
          axisLabelDistance: -10,
        },
        transitionDuration: 250,
      },
      title: {
        enable: true,
      },
    };
  }
}
