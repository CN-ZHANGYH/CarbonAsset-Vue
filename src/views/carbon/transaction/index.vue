<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="买家地址" prop="buyAddress">
        <el-input
          v-model="queryParams.buyAddress"
          placeholder="请输入买家地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="卖家地址" prop="sellerAddress">
        <el-input
          v-model="queryParams.sellerAddress"
          placeholder="请输入卖家地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交易数量" prop="transactionQuantity">
        <el-input
          v-model="queryParams.transactionQuantity"
          placeholder="请输入购买碳额度的数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['carbon:transaction:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="transactionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单的交易ID" align="center" prop="transactionId" />
      <el-table-column label="交易Hash" align="center" prop="txHash" />
      <el-table-column label="买家ID" align="center" prop="buyerId" />
      <el-table-column label="卖家的ID" align="center" prop="sellerId" />
      <el-table-column label="订单的名字" align="center" prop="transactionOrderName" />
      <el-table-column label="买家地址" align="center" prop="buyAddress" />
      <el-table-column label="卖家地址" align="center" prop="sellerAddress" />
      <el-table-column label="订单创建时间" align="center" prop="transactionTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.transactionTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买碳额度数量" align="center" prop="transactionQuantity" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tag>交易已上链</el-tag>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改交易碳额度记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="transactionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="买家ID" prop="buyerId">
          <el-input v-model="form.buyerId" placeholder="请输入买家ID" />
        </el-form-item>
        <el-form-item label="卖家的ID" prop="sellerId">
          <el-input v-model="form.sellerId" placeholder="请输入卖家的ID" />
        </el-form-item>
        <el-form-item label="订单的名字" prop="transactionOrderName">
          <el-input v-model="form.transactionOrderName" placeholder="请输入订单的名字" />
        </el-form-item>
        <el-form-item label="买家地址" prop="buyAddress">
          <el-input v-model="form.buyAddress" placeholder="请输入买家地址" />
        </el-form-item>
        <el-form-item label="卖家地址" prop="sellerAddress">
          <el-input v-model="form.sellerAddress" placeholder="请输入卖家地址" />
        </el-form-item>
        <el-form-item label="订单创建时间" prop="transactionTime">
          <el-date-picker clearable
            v-model="form.transactionTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择订单创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="购买碳额度的数量" prop="transactionQuantity">
          <el-input v-model="form.transactionQuantity" placeholder="请输入购买碳额度的数量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Transaction">
import { listTransaction, getTransaction, delTransaction, addTransaction, updateTransaction } from "@/api/carbon/transaction";

const { proxy } = getCurrentInstance();

const transactionList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    buyerId: null,
    sellerId: null,
    transactionOrderName: null,
    buyAddress: null,
    sellerAddress: null,
    transactionTime: null,
    transactionQuantity: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询交易碳额度记录列表 */
function getList() {
  loading.value = true;
  listTransaction(queryParams.value).then(response => {
    transactionList.value = response.rows;
    console.log(transactionList.value)
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    transactionId: null,
    buyerId: null,
    sellerId: null,
    transactionOrderName: null,
    buyAddress: null,
    sellerAddress: null,
    transactionTime: null,
    transactionQuantity: null
  };
  proxy.resetForm("transactionRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.transactionId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('carbon/transaction/export', {
    ...queryParams.value
  }, `transaction_${new Date().getTime()}.xlsx`)
}

getList();
</script>
