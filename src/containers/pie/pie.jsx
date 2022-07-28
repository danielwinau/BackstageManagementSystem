import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react';

export default class Pie extends Component {
  getOption = ()=>{
    return (
      {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        
        series: [
          {
            name: '销量',
            type: 'pie',
            data: [{value:5,name:'衬衫'},{value:20,name:'羊毛衫'},{value:36,name:'雪纺衫'},{value:10,name:'裤子'},{value:10,name:'高跟鞋'},{value:20,name:'袜子'}]
          }
        ]
      }
    )
  }
  render() {
    return (
      <ReactECharts option={this.getOption()} />
    )
  }
}