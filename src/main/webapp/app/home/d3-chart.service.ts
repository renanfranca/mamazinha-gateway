/**
 * ChartService to define the chart config for D3
 */
import { IBreastFeed } from 'app/entities/baby/breast-feed/breast-feed.model';
export class D3ChartService {
  static getChartConfig(d3ChartTranslate: any): any {
    return {
      chart: {
        type: 'lineChart',
        height: 250,
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
  static getDiscreteBarChartConfig(d3ChartTranslate: any): any {
    return {
      chart: {
        type: 'discreteBarChart',
        height: 250,
        margin: {
          top: 20,
          right: 25,
          bottom: 45,
          left: 45,
        },
        x(d: any): unknown {
          return d.label;
        },
        y(d: any): unknown {
          return d.value;
        },
        showValues: false,
        tooltip: {
          contentGenerator(e: any): any {
            const series: { key: string; value: number | null; color: string } = e.series[0];
            if (series.value === null) {
              return;
            }
            const chartData: { breastFeed: IBreastFeed; label: string; value: number } = e.data;

            const diffTotalMinutes = chartData.breastFeed.end!.diff(chartData.breastFeed.start, 'minute', true);
            let diffHours = '0';
            let diffMinutes = diffTotalMinutes;
            if (diffTotalMinutes >= 60) {
              diffHours = (diffTotalMinutes / 60).toFixed(0);
              diffMinutes = diffTotalMinutes % 60;
            }
            let diffMinutesFormat = `${diffMinutes}`;
            if (diffMinutes.toString().length === 1) {
              diffMinutesFormat = `0${diffMinutes}`;
            }
            const formatHoursAndMinutes = `${diffHours}:${diffMinutesFormat}`;

            const rows = `<tr>
                            <td class='key'>
                            ${d3ChartTranslate.duration as string}:
                            </td>
                            <td class='x-value'>${formatHoursAndMinutes}h</td>
                          </tr>
                          <tr>
                            <td class='key'>
                            ${d3ChartTranslate.start as string}:
                            </td>
                            <td class='x-value'>${chartData.breastFeed.start!.format('HH:mm')}h</td>
                          </tr>
                          <tr>
                            <td class='key'>
                            ${d3ChartTranslate.end as string}:
                            </td>
                            <td class='x-value'>${chartData.breastFeed.end!.format('HH:mm')}h</td>
                          </tr>`;

            const header = `<thead colspan="2">
                              <tr>
                                <td>
                                  <div class="legend-color-guide" style="
                                                float: left;
                                                vertical-align: middle;
                                                width: 12px;
                                                height: 12px;
                                                border: 1px solid ${series.color};
                                                background-color: ${series.color};
                                            ">
                                  </div>&nbsp;<strong>${series.key} ${d3ChartTranslate.time as string}</strong>
                                </td>
                              </tr>
                            </thead>`;

            return `<table>${header}<tbody>${rows}</tbody></table>`;
          },
        },
        useInteractiveGuideline: true,
        dispatch: {},
        xAxis: {
          axisLabelDistance: 3,
          showMaxMin: false,
          tickFormat: null,
        },
        yAxis: {
          axisLabel: '',
          axisLabelDistance: -20,
        },
        transitionDuration: 250,
      },
      title: {
        enable: true,
      },
    };
  }
}
