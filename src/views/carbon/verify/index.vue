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
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-steps :space="200" :active="3" simple style="margin-bottom: 15px">
      <el-step title="查看申请" :icon="Edit" />
      <el-step title="审批通过" :icon="UploadFilled" />
      <el-step title="资源排放" :icon="Picture" />
    </el-steps>

    <el-table v-loading="loading" :data="resourceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="排放资源的ID" align="center" prop="emissionId" />
      <el-table-column label="企业的ID" align="center" prop="enterpriseId" />
      <el-table-column label="排放的企业" align="center" prop="enterpriseAddress" />
      <el-table-column label="排放的量" align="center" prop="emissions" />
      <el-table-column label="排放的资源描述" align="center" prop="description" />
      <el-table-column label="排放的方式" align="center" prop="emissionWay" />
      <el-table-column label="是否批准排放" align="center" prop="isApprove" >
        <template #default="scope">
          <el-tag type="danger">未审批</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['carbon:resource:edit']">审核</el-button>
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
      <div v-if="resultValue == 0">
        <el-form ref="resourceRef" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="企业名称" prop="enterpriseAddress">
            <el-input v-model="form.enterpriseAddress" placeholder="请输入排放的企业" disabled/>
          </el-form-item>
          <el-form-item label="排放的量" prop="emissions">
            <el-input v-model="form.emissions" placeholder="请输入排放的量" disabled/>
          </el-form-item>
          <el-form-item label="资源描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入排放的资源描述" disabled/>
          </el-form-item>
          <el-form-item label="排放方式" prop="emissionWay">
            <el-input v-model="form.emissionWay" placeholder="请输入排放的方式" disabled/>
          </el-form-item>
          <el-form-item label="是否批准" prop="isApprove">
            <el-select-v2
                v-model="form.isApprove"
                :options="options"
                placeholder="请选择是否通过"
            >
            </el-select-v2>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="resultValue == 1">
        <el-result
            icon="success"
            title="审核成功"
            sub-title="该企业的排放资源申请已经审核通过"
        >
        </el-result>
      </div>


      <div v-if="resultValue == 2">
        <el-result
            icon="error"
            title="审核失败"
            sub-title="系统异常 请稍后重试"
        >
        </el-result>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" v-if="resultValue == 0">确 定</el-button>
          <el-button type="success" @click="cancel" v-if="resultValue == 1">关闭</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Resource">
import {
  listResource,
  delResource,
  addResource,
  updateResource,
  getIsNotVerifyList,
  getResource, verifyEnterpriseResource
} from "@/api/carbon/resource";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
import {Edit, Picture, UploadFilled} from "@element-plus/icons-vue";
import {parseTime} from "../../../utils/ruoyi";
import Cookies from "js-cookie";

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
const resultValue = ref(0)
const options = ref([
  {
    "label": "通过",
    "value": 1
  },
  {
    "label": "回退",
    "value": 0
  }
])

const data = reactive({
  verifyData: {},
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

const { queryParams, form, rules,verifyData } = toRefs(data);

/** 查询企业排放资源列表 */
function getList() {
  loading.value = true;
  getIsNotVerifyList(queryParams.value).then(response => {
    resourceList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  resultValue.value = 0
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
    title.value = "企业排放资源申请";
  });

}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["resourceRef"].validate(valid => {
    if (valid) {
      if (form.value.emissionId != null) {
        try {
          var regulator = JSON.parse(Cookies.get("regulator")).regulatorAddress;
          verifyData.value.regulatorAddress = regulator
          verifyData.value.enterpriseAddress = form.value.enterpriseAddress
          verifyData.value.emissionId = form.value.emissionId
          verifyData.value.isApprove = form.value.isApprove
        }catch (e) {
          return proxy.$modal.msgError("当前没有权限")
        }
        verifyEnterpriseResource(verifyData.value).then(res => {
          if (res.code == 200){
            proxy.$modal.msgSuccess("审批通过");
            getList();
            resultValue.value = 1
          }else {
            proxy.$modal.msgSuccess("审批异常");
            resultValue.value = 3
          }
        })
        //
        // updateResource(form.value).then(response => {
        //   proxy.$modal.msgSuccess("修改成功");
        //   open.value = false;
        //   getList();
        // });
      } else {
        // addResource(form.value).then(response => {
        //   proxy.$modal.msgSuccess("新增成功");
        //   open.value = false;
        //   getList();
        // });
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
