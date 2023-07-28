<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机构用户" prop="regulatorAddress">
        <el-input
          v-model="queryParams.regulatorAddress"
          placeholder="请输入机构登录用户"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构名称" prop="regulatorName">
        <el-input
          v-model="queryParams.regulatorName"
          placeholder="请输入机构名称"
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
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['carbon:regulator:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['carbon:regulator:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['carbon:regulator:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['carbon:regulator:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="regulatorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="监管机构ID" align="center" prop="regulatorId" />
      <el-table-column label="监管机构账户地址" align="center" prop="regulatorAddress" />
      <el-table-column label="部门名称" align="center" prop="regulatorName" />
      <el-table-column label="账户类型" align="center" prop="userType" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['carbon:regulator:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['carbon:regulator:remove']">删除</el-button>
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

    <!-- 添加或修改监管机构信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="regulatorRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="regulatorAddress">
          <el-input v-model="form.regulatorUser" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="机构名称" prop="regulatorName">
          <el-input v-model="form.regulatorName" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="登录密码" prop="regulatorName">
          <el-input v-model="form.regulatorPass" placeholder="请输入登录密码" />
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

<script setup name="Regulator">
import { listRegulator, getRegulator, delRegulator, addRegulator, updateRegulator } from "@/api/carbon/regulator";

const { proxy } = getCurrentInstance();

const regulatorList = ref([]);
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
    regulatorAddress: null,
    regulatorUser: null,
    regulatorPass: null,
    regulatorName: null,
    userType: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询监管机构信息列表 */
function getList() {
  loading.value = true;
  listRegulator(queryParams.value).then(response => {
    regulatorList.value = response.rows;
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
    regulatorId: null,
    regulatorAddress: null,
    regulatorName: null,
    userType: null
  };
  proxy.resetForm("regulatorRef");
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
  ids.value = selection.map(item => item.regulatorId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加监管机构信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _regulatorId = row.regulatorId || ids.value
  getRegulator(_regulatorId).then(response => {
    console.log(response)
    form.value = response.data;
    open.value = true;
    title.value = "修改监管机构信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["regulatorRef"].validate(valid => {
    if (valid) {
      if (form.value.regulatorId != null) {
        updateRegulator(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRegulator(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _regulatorIds = row.regulatorId || ids.value;
  proxy.$modal.confirm('是否确认删除监管机构信息编号为"' + _regulatorIds + '"的数据项？').then(function() {
    return delRegulator(_regulatorIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('carbon/regulator/export', {
    ...queryParams.value
  }, `regulator_${new Date().getTime()}.xlsx`)
}

getList();
</script>
