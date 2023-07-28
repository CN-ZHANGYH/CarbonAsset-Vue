<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
<<<<<<< HEAD
      <el-form-item label="排放的方式名称" prop="name">
=======
      <el-form-item label="排放方式" prop="name">
>>>>>>> 0c7f93b (更新项目)
        <el-input
          v-model="queryParams.name"
          placeholder="请输入排放的方式名称"
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
          v-hasPermi="['carbon:method:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['carbon:method:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['carbon:method:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['carbon:method:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="methodList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<<<<<<< HEAD
      <el-table-column label="排放的方式ID" align="center" prop="id" />
      <el-table-column label="排放的方式名称" align="center" prop="name" />
      <el-table-column label="排放方式的描述" align="center" prop="description" />
=======
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="排放方式" align="center" prop="name" />
      <el-table-column label="排放描述" align="center" prop="description" />
>>>>>>> 0c7f93b (更新项目)
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['carbon:method:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['carbon:method:remove']">删除</el-button>
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

    <!-- 添加或修改排放方式的对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="methodRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="排放的方式名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入排放的方式名称" />
        </el-form-item>
        <el-form-item label="排放方式的描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
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

<script setup name="Method">
import { listMethod, getMethod, delMethod, addMethod, updateMethod } from "@/api/carbon/method";

const { proxy } = getCurrentInstance();

const methodList = ref([]);
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
    name: null,
    description: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询排放方式的列表 */
function getList() {
  loading.value = true;
  listMethod(queryParams.value).then(response => {
    methodList.value = response.rows;
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
    id: null,
    name: null,
    description: null
  };
  proxy.resetForm("methodRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加排放方式的";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getMethod(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改排放方式的";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["methodRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateMethod(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMethod(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除排放方式的编号为"' + _ids + '"的数据项？').then(function() {
    return delMethod(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('carbon/method/export', {
    ...queryParams.value
  }, `method_${new Date().getTime()}.xlsx`)
}

getList();
</script>
