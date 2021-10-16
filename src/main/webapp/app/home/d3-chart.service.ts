/**
 * ChartService to define the chart config for D3
 */
export class D3ChartService {
  static getChartConfig(d3ChartTranslate: any): any {
    return {
      chart: {
        type: 'lineChart',
        height: 200,
        margin: {
          top: 20,
          right: 25,
          bottom: 45,
          left: 45,
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
          axisLabelDistance: 3,
          showMaxMin: false,
          tickFormat(d: any): any {
            if (d === 1) {
              return d3ChartTranslate.monday;
            }
            if (d === 2) {
              return d3ChartTranslate.tuesday;
            }
            if (d === 3) {
              return d3ChartTranslate.wednesday;
            }
            if (d === 4) {
              return d3ChartTranslate.thusday;
            }
            if (d === 5) {
              return d3ChartTranslate.friday;
            }
            if (d === 6) {
              return d3ChartTranslate.saturday;
            }
            return d3ChartTranslate.sunday;
          },
        },
        xDomain: [1, 7],
        yAxis: {
          axisLabel: '',
          axisLabelDistance: -25,
        },
        transitionDuration: 250,
      },
      title: {
        enable: true,
      },
    };
  }
}
