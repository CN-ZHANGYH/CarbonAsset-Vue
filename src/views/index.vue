<template>
  <div class="app-container">
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="container">
            <div id="myChart" :style="{ width: '50%', height: '280px' }"></div>
            <div style="margin-right: 30px;margin-top: 30px">
              <el-progress type="dashboard" :percentage="100" width="200" stroke-width="20">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">全球环保率</span>
                </template>
              </el-progress>
            </div>
          </div>
          <div class="container">
            <span style="margin-left: 19%;font-weight: 1000">在线人数</span>
            <span style="margin-right: 18%;font-weight: 1000">全球环保</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div id="main" :style="{ width: '90%', height: '300px' }"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div id="meigui" :style="{ width: '90%', height: '300px' }"></div>
        </el-card>
      </el-col>
    </el-row>


    <el-card shadow="hover" style="height: 500px;margin-top: 20px">
      <el-row :gutter="20">
        <el-col :span="13">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
            <el-table-column prop="address" label="Address">
              <template #default="scope">
                <el-tag>交易完成</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script setup name="Index">
import * as echarts from 'echarts'
import {onMounted, reactive, ref, watch} from "vue";


var ROOT_PATH = 'https://echarts.apache.org/examples';

const version = ref('3.8.6')

function goTarget(url) {
  window.open(url, '__blank')
}

const mainState = reactive(
    {
      option: {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
          text: '测试'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Line 1',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgb(1, 191, 236)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [140, 232, 101, 264, 90, 340, 250]
          },
          {
            name: 'Line 2',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(0, 221, 255)'
                },
                {
                  offset: 1,
                  color: 'rgb(77, 119, 255)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 282, 111, 234, 220, 340, 310]
          },
          {
            name: 'Line 3',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(55, 162, 255)'
                },
                {
                  offset: 1,
                  color: 'rgb(116, 21, 219)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 132, 201, 334, 190, 130, 220]
          },
          {
            name: 'Line 4',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 0, 135)'
                },
                {
                  offset: 1,
                  color: 'rgb(135, 0, 157)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 402, 231, 134, 190, 230, 120]
          },
          {
            name: 'Line 5',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 191, 0)'
                },
                {
                  offset: 1,
                  color: 'rgb(224, 62, 76)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 302, 181, 234, 210, 290, 150]
          }
        ]
      }
    }
)

const state = reactive({
  option: {
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: 20
        },
        axisLine: {
          lineStyle: {
            width: 30
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 7,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 25,
          color: '#999',
          fontSize: 13
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 15,
          itemStyle: {
            borderWidth: 10
          }
        },
        title: {
          show: true,

        },
        detail: {
          valueAnimation: true,
          fontSize: 30,
          offsetCenter: [0, '70%']
        },
        data: [
          {
            value: 70
          }
        ]
      }
    ]
  }
})


const meiguiState = reactive({
  option: {
    legend: {
      top: 'bottom'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [20, 100],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          { value: 40, name: 'rose 1' },
          { value: 38, name: 'rose 2' },
          { value: 32, name: 'rose 3' },
          { value: 30, name: 'rose 4' },
          { value: 28, name: 'rose 5' },
          { value: 26, name: 'rose 6' }
        ]
      }
    ]
  }
})

const initeCharts = () => {
  let myChart = echarts.init(document.getElementById('myChart'))
  let mainChart = echarts.init(document.getElementById('main'))
  let meiguiChart = echarts.init(document.getElementById('meigui'))

  // 绘制图表
  myChart.setOption(state.option)
  mainChart.setOption(mainState.option)
  meiguiChart.setOption(meiguiState.option)
}
onMounted(() => {
  initeCharts()
  fetchTableData()
  setInterval(fetchTableData, 3000); // 每隔3秒打乱一次数据

})



const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Jack',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Jeene',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'LIWI',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'XIEUYE',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'ASDAD',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'ASDS',
    address: 'No. 189, Grove St, Los Angeles',
  },
])


const shuffledData = ref([]);
const fetchTableData = () => {
  tableData.value.sort(() => Math.random() - 0.5);
  console.log(shuffledData.value)
};



</script>

<style scoped>
.percentage-value {
  //display: block;
  //margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  //margin-top: 10px;
  font-size: 12px;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

