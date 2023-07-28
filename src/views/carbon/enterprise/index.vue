<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业地址" prop="enterpriseAddress">
        <el-input
            v-model="queryParams.enterpriseAddress"
            placeholder="请输入企业账户地址"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input
            v-model="queryParams.enterpriseName"
            placeholder="请输入企业的名称"
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
            v-hasPermi="['carbon:enterprise:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['carbon:enterprise:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['carbon:enterprise:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['carbon:enterprise:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="enterpriseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="企业ID" align="center" prop="enterpriseId" />
      <el-table-column label="企业账户地址" align="center" prop="enterpriseAddress" />
      <el-table-column label="企业的私钥" align="center" prop="priavateKey" />
      <el-table-column label="企业的名称" align="center" prop="enterpriseName" />
      <el-table-column label="企业的余额" align="center" prop="enterpriseBalance" />
      <el-table-column label="总需排放的量" align="center" prop="enterpriseTotalEmission" />
      <el-table-column label="已完成排放量" align="center" prop="enterpriseOverEmission" />
      <el-table-column label="奖励积分" align="center" prop="enterpriseCarbonCredits" />
      <el-table-column label="是否通过审核" align="center" prop="enterpriseVerified" />
      <el-table-column label="账户角色" align="center" prop="userType" />
      <el-table-column label="资质信息ID" align="center" prop="qualificationId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['carbon:enterprise:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['carbon:enterprise:remove']">删除</el-button>
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

    <!-- 添加或修改企业信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="enterpriseRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="enterpriseName">
          <el-input v-model="form.enterpriseName" placeholder="请输入企业的登录名"  />
        </el-form-item>
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-input v-model="form.enterpriseNickName" placeholder="请输入企业的名称" />
        </el-form-item>
        <el-form-item label="登录密码" prop="enterpriseName">
          <el-input v-model="form.enterprisePass" placeholder="请输入企业的账号密码" />
        </el-form-item>
        <el-form-item label="企业邮箱" prop="enterpriseName">
          <el-input v-model="form.enterpriseEmail" placeholder="请输入企业的邮箱" />
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

<script setup name="Enterprise">
import {
  listEnterprise,
  getEnterprise,
  delEnterprise,
  addEnterprise,
  updateEnterprise,
  getNewUserKeyAndAddress
} from "@/api/carbon/enterprise";
import {reactive, ref, toRefs} from "vue";

const { proxy } = getCurrentInstance();

const enterpriseList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

let newUser = reactive({
  address: "",
  privateKey: "",
  publicKey: ""
})

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseAddress: null,
    priavateKey: null,
    enterpriseName: null,
    enterpriseBalance: null,
    enterpriseTotalEmission: null,
    enterpriseOverEmission: null,
    enterpriseCarbonCredits: null,
    enterpriseVerified: null,
    userType: null,
    qualificationId: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
const activeNames = ref([])

/** 查询企业信息列表 */
function getList() {
  loading.value = true;
  listEnterprise(queryParams.value).then(response => {
    enterpriseList.value = response.rows;
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
    enterpriseId: null,
    enterpriseAddress: null,
    priavateKey: null,
    enterpriseName: null,
    enterpriseNickName: null,
    enterpriseEmail: null,
    enterprisePass: null,
    enterpriseBalance: null,
    enterpriseTotalEmission: null,
    enterpriseOverEmission: null,
    enterpriseCarbonCredits: null,
    enterpriseVerified: null,
    userType: null,
    qualificationId: null
  };
  newUser.address = null
  newUser.privateKey  = null
  newUser.publicKey = null
  activeNames.value = []
  proxy.resetForm("enterpriseRef");
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
  ids.value = selection.map(item => item.enterpriseId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加企业信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _enterpriseId = row.enterpriseId || ids.value
  getEnterprise(_enterpriseId).then(response => {
    console.log(response.data)
    form.value = response.data;
    open.value = true;
    title.value = "修改企业信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["enterpriseRef"].validate(valid => {
    if (valid) {
      if (form.value.enterpriseId != null) {
        updateEnterprise(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEnterprise(form.value).then(response => {
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
  const _enterpriseIds = row.enterpriseId || ids.value;
  proxy.$modal.confirm('是否确认删除企业信息编号为"' + _enterpriseIds + '"的数据项？').then(function() {
    return delEnterprise(_enterpriseIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('carbon/enterprise/export', {
    ...queryParams.value
  }, `enterprise_${new Date().getTime()}.xlsx`)
}


function getNewUserKey() {
  getNewUserKeyAndAddress().then(response=> {
    if (response.code == 200){
      newUser.address = response.user.address
      newUser.privateKey = response.user.privateKey
      newUser.publicKey  = response.user.publicKey
      proxy.$modal.msgSuccess("获取成功")
      activeNames.value = ['1','2','3']
    }
  })
}
getList();
</script>
