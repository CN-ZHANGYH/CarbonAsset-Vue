<template>
  <div class="app-container">
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="container">
            <div ref="online" id="online" :style="{ width: '50%', height: '300px' }"></div>
            <div style="margin-right: 30px;margin-top: 10px">
              <el-progress type="dashboard" :percentage="totalOnline" width="200" stroke-width="20">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}</span>
                  <span class="percentage-label">平台在线人数</span>
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


    <el-card shadow="hover" style="height: 520px;margin-top: 20px">
      <el-row :gutter="20">
        <el-col :span="13">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="transactionId" label="ID" width="50" />
            <el-table-column prop="buyAddress" label="买家地址" width="200">
            <template #default="scope">
              <el-tag type="success">{{truncatedString(scope.row.buyAddress)}}</el-tag>
            </template>
            </el-table-column>
            <el-table-column prop="sellerAddress" label="卖家地址" width="200">
            <template #default="scope">
              <el-tag  type="success"
              >{{truncatedString(scope.row.sellerAddress)}}</el-tag>
            </template>
            </el-table-column>
            <el-table-column prop="txHash" label="交易哈希" width="200">
              <template #default="scope">
                <el-popover
                    placement="top-start"
                    title="交易HASH"
                    :width="400"
                    trigger="hover"
                    :content="scope.row.txHash"
                >
                  <template #reference>
                    <el-tag
                        type="success"
                        class="mx-1"
                        effect="dark"
                    >{{truncatedString(scope.row.txHash)}}</el-tag>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="transactionQuantity" label="交易数量"  width="100"/>
            <el-table-column prop="#" label="状态">
              <template #default="scope">
                <el-check-tag :checked="true">交易完成</el-check-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6" style="margin-left: 40px">
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="介绍" name="first">
              <el-carousel :interval="5000" arrow="always" >
                <el-carousel-item v-for="(item,index) in items" :key="item">
                  <img :src="item" alt="" style="height: 100%;width: 100%"/>
                </el-carousel-item>
              </el-carousel>
            </el-tab-pane>
            <el-tab-pane label="平台使用流程" name="second">
              <el-timeline >
                <el-timeline-item timestamp="2023/4/12" placement="top" type="primary" color="#0bbd87">
                  <el-card>
                    <p>监管机构登录平台</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2023/4/12" placement="top" type="primary" color="#0bbd87">
                  <el-card>
                    <p>审批企业的资质认证</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2023/4/12" placement="top" type="primary" color="#0bbd87">
                  <el-card>
                    <p>审批企业的碳排放申请</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
            <el-tab-pane label="Role" name="third">Role</el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script setup name="Index">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, reactive, ref, toRefs} from "vue";
import {getFootPrintList, getNewTxList, getResourceTypeList} from "@/api/carbon/data";
import {list as initData} from "@/api/monitor/online";

const activeName = ref('first')
const totalOnline = ref(0)
const resourcedata = ref([])
const footdate = ref([])


const items = reactive([
    'https://blog-1304715799.cos.ap-nanjing.myqcloud.com/imgs/202307302237603.png',
    'https://blog-1304715799.cos.ap-nanjing.myqcloud.com/imgs/202307302237603.png',
    'https://blog-1304715799.cos.ap-nanjing.myqcloud.com/imgs/202307302237603.png'
])
const resourceState = reactive({
  option: {
    title: {
      text: '排放资源占比'
    },
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

function truncatedString(val){
  return val.substring(0, 20) + '...';
}


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

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 40px;
  font-weight: 1000;
}


.demo-tabs {
  width: 650px;
  height: 100%;
}
</style>

