<template>
  <div class="app-container">
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="container">
            <div ref="online" id="online" :style="{ width: '50%', height: '300px' }"></div>
            <div style="margin-right: 30px;margin-top: 30px">
              <el-progress type="dashboard" :percentage="totalOnline" width="200" stroke-width="20">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}</span>
                  <span class="percentage-label">全球环保率</span>
                </template>
              </el-progress>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div ref="footprint" id="footprint" :style="{ width: '100%', height: '300px' }"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div ref="resourceType" id="resourceType" :style="{ width: '90%', height: '300px' }"></div>
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
import {nextTick, onBeforeMount, onMounted, onUnmounted, reactive, ref, toRefs, watch} from "vue";
import {getFootPrintList, getNewTxList, getResourceTypeList} from "@/api/carbon/data";
import {list as initData} from "@/api/monitor/online";


const totalOnline = ref(0)
const resourcedata = ref([])
const footdate = ref([])
const resourceState = reactive({
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
        data: resourcedata.value
      }
    ]
  }
})
const footprintState = reactive({footOption: {
    color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
    title: {
      text: '碳足迹',
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
      left: '15%',
      data: ['交易数量', '碳排放', '企业认证', '资产出售']
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
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '交易数量',
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
        data: []
      },
      {
        name: '碳排放',
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
        data: []
      },
      {
        name: '企业认证',
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
        data: []
      },
      {
        name: '资产出售',
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
        data: []
      }
    ]
  }})
const onlineState = reactive({
  onlineOption: {
    title: {
      text: '在线人数',
    },
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: 20
        },
        axisLine: {
          lineStyle: {
            width: 20
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
          distance: 20,
          color: '#999',
          fontSize: 12
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
            value: 0
          }
        ]
      }
    ]
  }
})

const {option} = toRefs(resourceState)
const {footOption} = toRefs(footprintState)
const {onlineOption} = toRefs(onlineState)
const tableData = ref([])

const resourceType = ref(null)
const timer = ref([])

const init = () => {
  // 初始化人数
  initData().then(response => {
    totalOnline.value = response.total;
    onlineOption.value.series[0].data[0].value = totalOnline.value
    var onlineChart = echarts.init(document.getElementById("online"))
    onlineChart.setOption(onlineOption.value)
  });

  // 初始化碳足迹
  getFootPrintList().then(res => {
    footdate.value = res.data
    footOption.value.series[0].data = footdate.value[0]
    footOption.value.series[1].data = footdate.value[1]
    footOption.value.series[2].data = footdate.value[2]
    footOption.value.series[3].data = footdate.value[3]

    var footChart = echarts.init(document.getElementById("footprint"))
    footChart.setOption(footOption.value)
  })

  // 初始化饼状图
  getResourceTypeList().then(res => {
    resourcedata.value = res.data
    option.value.series[0].data = resourcedata.value

    var resourceChart = echarts.init(document.getElementById("resourceType"))
    // 指定图表的配置项
    resourceChart.setOption(option.value)
  })


  // 获取最新的10笔交易
  getNewTxList().then(res => {
    console.log(res.data)
    tableData.value = res.data
  })
}
onMounted(() => {
  init()
  fetchTableData()
  timer.value.push(setInterval(fetchTableData, 3000));
  timer.value.push(setInterval(init,1000))
})

onUnmounted(() => {
  for (const timerElement of timer.value) {
    clearInterval(timerElement)
  }
  timer.value=[]
})


const fetchTableData = () => {
  tableData.value.sort(() => Math.random() - 0.5);
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

