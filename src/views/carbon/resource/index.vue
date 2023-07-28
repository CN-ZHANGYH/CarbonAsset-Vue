<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="排放企业" prop="enterpriseAddress">
        <el-input
          v-model="queryParams.enterpriseAddress"
          placeholder="请输入排放的企业"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排放方式" prop="emissionWay">
        <el-input
          v-model="queryParams.emissionWay"
          placeholder="请输入排放的方式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排放时间" prop="emissionTime">
        <el-date-picker clearable
          v-model="queryParams.emissionTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择排放时间">
        </el-date-picker>
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
          v-hasPermi="['carbon:resource:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['carbon:resource:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['carbon:resource:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['carbon:resource:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="resourceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="排放资源的ID" align="center" prop="emissionId" />
      <el-table-column label="企业的ID" align="center" prop="enterpriseId" />
      <el-table-column label="排放的企业" align="center" prop="enterpriseAddress" />
      <el-table-column label="排放的量" align="center" prop="emissions" />
      <el-table-column label="排放的资源描述" align="center" prop="description" />
      <el-table-column label="排放的方式" align="center" prop="emissionWay" />
      <el-table-column label="是否批准排放" align="center" prop="isApprove" />
      <el-table-column label="排放时间" align="center" prop="emissionTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.emissionTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['carbon:resource:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['carbon:resource:remove']">删除</el-button>
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

    <!-- 添加或修改企业排放资源对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="resourceRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="企业的ID" prop="enterpriseId">
          <el-input v-model="form.enterpriseId" placeholder="请输入企业的ID" />
        </el-form-item>
        <el-form-item label="排放的企业" prop="enterpriseAddress">
          <el-input v-model="form.enterpriseAddress" placeholder="请输入排放的企业" />
        </el-form-item>
        <el-form-item label="排放的量" prop="emissions">
          <el-input v-model="form.emissions" placeholder="请输入排放的量" />
        </el-form-item>
        <el-form-item label="排放的资源描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入排放的资源描述" />
        </el-form-item>
        <el-form-item label="排放的方式" prop="emissionWay">
          <el-input v-model="form.emissionWay" placeholder="请输入排放的方式" />
        </el-form-item>
        <el-form-item label="是否批准排放" prop="isApprove">
          <el-input v-model="form.isApprove" placeholder="请输入是否批准排放" />
        </el-form-item>
        <el-form-item label="排放时间" prop="emissionTime">
          <el-date-picker clearable
            v-model="form.emissionTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择排放时间">
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

<script setup name="Resource">
import { listResource, getResource, delResource, addResource, updateResource } from "@/api/carbon/resource";

const { proxy } = getCurrentInstance();

const resourceList = ref([]);
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
    emissions: null,
    description: null,
    emissionWay: null,
    isApprove: null,
    emissionTime: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询企业排放资源列表 */
function getList() {
  loading.value = true;
  listResource(queryParams.value).then(response => {
    resourceList.value = response.rows;
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
    emissionId: null,
    enterpriseId: null,
    enterpriseAddress: null,
    emissions: null,
    description: null,
    emissionWay: null,
    isApprove: null,
    emissionTime: null
  };
  proxy.resetForm("resourceRef");
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
  ids.value = selection.map(item => item.emissionId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加企业排放资源";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _emissionId = row.emissionId || ids.value
  getResource(_emissionId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改企业排放资源";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["resourceRef"].validate(valid => {
    if (valid) {
      if (form.value.emissionId != null) {
        updateResource(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addResource(form.value).then(response => {
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
  const _emissionIds = row.emissionId || ids.value;
  proxy.$modal.confirm('是否确认删除企业排放资源编号为"' + _emissionIds + '"的数据项？').then(function() {
    return delResource(_emissionIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('carbon/resource/export', {
    ...queryParams.value
  }, `resource_${new Date().getTime()}.xlsx`)
}

getList();
</script>
