<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业的ID" prop="enterpriseId">
        <el-input
          v-model="queryParams.enterpriseId"
          placeholder="请输入企业的ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账户地址" prop="enterpriseAddress">
        <el-input
          v-model="queryParams.enterpriseAddress"
          placeholder="请输入企业的账户地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数量" prop="assetQuantity">
        <el-input
          v-model="queryParams.assetQuantity"
          placeholder="请输入出售碳资产的数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="assetList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资产ID" align="center" prop="assetId" />
      <el-table-column label="企业ID" align="center" prop="enterpriseId" />
      <el-table-column label="企业账户地址" align="center" prop="enterpriseAddress" />
      <el-table-column label="碳额度数量" align="center" prop="assetQuantity" />
      <el-table-column label="单价" align="center" prop="assetAmount" />
      <el-table-column label="出售时间" align="center" prop="time" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出售订单的状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tag>该资产已经上链</el-tag>
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

    <!-- 添加或修改企业出售资产对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="assetRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="企业的ID" prop="enterpriseId">
          <el-input v-model="form.enterpriseId" placeholder="请输入企业的ID" />
        </el-form-item>
        <el-form-item label="企业出售碳资产的账户地址" prop="enterpriseAddress">
          <el-input v-model="form.enterpriseAddress" placeholder="请输入企业出售碳资产的账户地址" />
        </el-form-item>
        <el-form-item label="企业出售碳资产的数量" prop="assetQuantity">
          <el-input v-model="form.assetQuantity" placeholder="请输入企业出售碳资产的数量" />
        </el-form-item>
        <el-form-item label="企业出售碳资产的价钱" prop="assetAmount">
          <el-input v-model="form.assetAmount" placeholder="请输入企业出售碳资产的价钱" />
        </el-form-item>
        <el-form-item label="企业出售碳资产的时间" prop="time">
          <el-date-picker clearable
            v-model="form.time"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择企业出售碳资产的时间">
          </el-date-picker>
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

<script setup name="Asset">
import { listAsset, getAsset, delAsset, addAsset, updateAsset } from "@/api/carbon/asset";

const { proxy } = getCurrentInstance();

const assetList = ref([]);
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
    enterpriseId: null,
    enterpriseAddress: null,
    assetQuantity: null,
    assetAmount: null,
    time: null,
    status: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询企业出售资产列表 */
function getList() {
  loading.value = true;
  listAsset(queryParams.value).then(response => {
    assetList.value = response.rows;
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
    assetId: null,
    enterpriseId: null,
    enterpriseAddress: null,
    assetQuantity: null,
    assetAmount: null,
    time: null,
    status: null
  };
  proxy.resetForm("assetRef");
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
  ids.value = selection.map(item => item.assetId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


getList();
</script>
