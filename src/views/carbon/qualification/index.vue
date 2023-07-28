<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业名称" prop="qualificationName">
        <el-input
            v-model="queryParams.qualificationName"
            placeholder="请输入企业名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="代表人" prop="qualificationLeader">
        <el-input
            v-model="queryParams.qualificationLeader"
            placeholder="请输入法定代表人"
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
            v-hasPermi="['carbon:qualification:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['carbon:qualification:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['carbon:qualification:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['carbon:qualification:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="qualificationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资质ID" align="center" prop="qualificationId" />
      <el-table-column label="企业名称" align="center" prop="qualificationName" />
      <el-table-column label="信用代码" align="center" prop="qualificationContent" />
      <el-table-column label="代表人" align="center" prop="qualificationLeader" />
      <el-table-column label="注册地址" align="center" prop="qualificationAddress" />
      <el-table-column label="所属行业" align="center" prop="qualificationIndustry" />
      <el-table-column label="联系人" align="center" prop="qualificationUserName" />
      <el-table-column label="邮箱" align="center" prop="qualificationUserEmail" />
      <el-table-column label="资质认证" align="center" prop="qualificationUrl" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.qualificationUrl" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" align="center" prop="qualificationUploadTime" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.qualificationUploadTime, '{yyyy}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="qualificationAuditTime" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.qualificationAuditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="监管机构" align="center" prop="qualificationVerifiedRegulator" />
      <el-table-column label="碳额度" align="center" prop="qualificationEmissionLimit" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleAudit(scope.row)" v-hasPermi="['carbon:qualification:edit']">审核</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['carbon:qualification:remove']">删除</el-button>
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

    <!-- 添加或修改企业资质信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="qualificationRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="企业名称" prop="qualificationName">
          <el-input v-model="form.qualificationName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="信用代码">
          <el-input v-model="form.qualificationContent" placeholder="请输入信用代码" />
        </el-form-item>
        <el-form-item label="法定代表人" prop="qualificationLeader">
          <el-input v-model="form.qualificationLeader" placeholder="请输入法定代表人" />
        </el-form-item>
        <el-form-item label="注册地址" prop="qualificationAddress">
          <el-input v-model="form.qualificationAddress" placeholder="请输入注册地址" />
        </el-form-item>
        <el-form-item label="所属行业" prop="qualificationIndustry">
          <el-select-v2
              v-model="form.qualificationIndustry"
              :options="options"
              placeholder="请选择你的行业"
              style="width: 360px"
          ></el-select-v2>

        </el-form-item>
        <el-form-item label="联系人姓名" prop="qualificationUserName">
          <el-input v-model="form.qualificationUserName" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人邮箱" prop="qualificationUserEmail">
          <el-input v-model="form.qualificationUserEmail" placeholder="请输入联系人邮箱" />
        </el-form-item>
        <el-form-item label="企业资质">
          <el-upload class="avatar-uploader"
                     action=""
                     :http-request="upload"
                     :before-upload="beforeAvatarUpload"
                     draggable="true"
                     :show-file-list="false">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 审核企业资质信息对话框 -->
    <el-dialog  :title="title" v-model="isShowQua" width="1000px" append-to-body>
      <el-steps :active="stepNow" finish-status="success" simple style="margin-top: 10px;margin-bottom: 20px;">
        <el-step title="核对资质" />
        <el-step title="审核资质" />
        <el-step title="提交上链" />
      </el-steps>

      <div class="container" v-if="stepNow == 1">
        <div class="form-container">
          <el-form  ref="qualificationRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="企业名称" prop="qualificationName">
              <el-input v-model="form.qualificationName"  disabled/>
            </el-form-item>
            <el-form-item label="信用代码">
              <el-input v-model="form.qualificationContent"  disabled/>
            </el-form-item>
            <el-form-item label="法定代表人" prop="qualificationLeader">
              <el-input v-model="form.qualificationLeader"  disabled/>
            </el-form-item>
            <el-form-item label="注册地址" prop="qualificationAddress">
              <el-input v-model="form.qualificationAddress"  disabled/>
            </el-form-item>
            <el-form-item label="所属行业" prop="qualificationIndustry">
              <el-input v-model="form.qualificationIndustry"  disabled/>
            </el-form-item>
            <el-form-item label="联系人姓名" prop="qualificationUserName">
              <el-input v-model="form.qualificationUserName"  disabled/>
            </el-form-item>
            <el-form-item label="联系邮箱" prop="qualificationUserEmail">
              <el-input v-model="form.qualificationUserEmail"  disabled/>
            </el-form-item>
            <el-form-item label="上传时间" prop="qualificationUserEmail">
              <el-input v-model="form.qualificationUploadTime"  disabled/>
            </el-form-item>
          </el-form>
        </div>
        <div  class="image-container">
          <img :src="form.qualificationUrl" alt="" style="width: 400px;height: 380px;border-radius: 10px;border: 5px solid green"/>
        </div>
      </div>

    <!-- 用于监管机构审核的页面 -->
      <div v-if="stepNow == 2">
        <el-form :model="org"  label-width="100px">
          <el-form-item label="当前所属机构">
            <el-input v-model="org.regulatorAddress"  disabled/>
          </el-form-item>
        </el-form>

        <el-radio-group v-model="form.isApprove" size="large">
          <el-radio-button label="false">不通过</el-radio-button>
          <el-radio-button label="true" >通过</el-radio-button>
        </el-radio-group>
      </div>

      <div v-if="stepNow == 3" >
        <el-row>
          <el-col :sm="60" >
            <el-result
                icon="success"
                title="Success"
                sub-title="当前已经审核成功，该企业的资质正在上链"
            >
            </el-result>
          </el-col>
        </el-row>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="frontStep" v-if="stepNow != 1">上一步</el-button>
          <el-button type="primary" @click="nextStep" v-if="stepNow != 3">下一步</el-button>
          <el-button type="primary" @click="auditForm" v-if="stepNow == 3">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="Qualification">
import {
  listQualification,
  getQualification,
  delQualification,
  addQualification,
  updateQualification,
  getIndustryTag,
  verifyQualification, uploadQualification
} from "@/api/carbon/qualification";
import {getCurrentInstance, reactive, ref, toRefs, watch} from "vue";

import Cookies from 'js-cookie'
const { proxy } = getCurrentInstance();

const qualificationList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const isShowQua = ref(false)
const file = ref(null)
const imageUrl = ref("")
const stepNow = ref(1)
const radio = ref("")

const data = reactive({
  org: {},
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    qualificationName: null,
    qualificationContent: null,
    qualificationLeader: null,
    qualificationAddress: null,
    qualificationIndustry: null,
    qualificationUserName: null,
    qualificationUserEmail: null,
    qualificationUrl: null,
    qualificationUploadTime: null,
    qualificationAuditTime: null,
    qualificationVerifiedRegulator: null,
    qualificationEmissionLimit: null
  },
  rules: {},
  options: []
});

const { queryParams, form, rules ,org,options} = toRefs(data);

/** 查询企业资质信息列表 */
function getList() {
  loading.value = true;
  listQualification(queryParams.value).then(response => {
    qualificationList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false
  isShowQua.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    qualificationId: null,
    qualificationName: null,
    qualificationContent: null,
    qualificationLeader: null,
    qualificationAddress: null,
    qualificationIndustry: null,
    qualificationUserName: null,
    qualificationUserEmail: null,
    qualificationUrl: null,
    qualificationUploadTime: null,
    qualificationAuditTime: null,
    qualificationVerifiedRegulator: null,
    qualificationEmissionLimit: null
  };
  proxy.resetForm("qualificationRef");
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
  ids.value = selection.map(item => item.qualificationId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加企业资质信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _qualificationId = row.qualificationId || ids.value
  getQualification(_qualificationId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改企业资质信息";
  });
}

function handleAudit(row){
  reset();
  const _qualificationId = row.qualificationId || ids.value
  getQualification(_qualificationId).then(response => {
    form.value = response.data;
    isShowQua.value = true
    title.value = "审核企业资质信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["qualificationRef"].validate(valid => {
    if (valid) {
      if (form.value.qualificationId != null) {
        updateQualification(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        console.log(form.value)
        addQualification(form.value).then(response => {
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
  const _qualificationIds = row.qualificationId || ids.value;
  proxy.$modal.confirm('是否确认删除企业资质信息编号为"' + _qualificationIds + '"的数据项？').then(function() {
    return delQualification(_qualificationIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('carbon/qualification/export', {
    ...queryParams.value
  }, `qualification_${new Date().getTime()}.xlsx`)
}

// 上传图片的校验
function beforeAvatarUpload(file) {
  // 允许的图片格式
  const allowedFormats = ['jpeg', 'jpg', 'png', 'gif'];

  const isLt2M = file.size / 1024 / 1024 < 2;
  const fileExtension = file.name.split('.').pop().toLowerCase();

  if (!isLt2M) {
    proxy.$modal.msgError('上传头像图片大小不能超过 2MB!');
  }

  if (!allowedFormats.includes(fileExtension)) {
    proxy.$modal.msgError('上传头像图片格式不支持!');
  }
}

//使用element plus上传的话类型应该是UploadProps，取文件得用file.raw
function upload(file) {
  uploadQualification(file).then(res => {
    if (res.code == 200){
      imageUrl.value = res.imgUrl
      form.value.qualificationUrl = res.imgUrl
      proxy.$modal.msgSuccess("上传成功")
    }
  }).catch(error => {
    proxy.$modal.msgError("上传失败")
  })
}
function frontStep(){
  stepNow.value -= 1
}

function nextStep(){
  if (stepNow.value == 1){
    try {
      var regulator = JSON.parse(Cookies.get("regulator"));
      org.value = regulator
      form.value.qualificationVerifiedRegulator = regulator.regulatorAddress
      stepNow.value += 1
    }catch (e) {
      isShowQua.value = false
      return proxy.$modal.msgError("当前没有权限")
    }
  }else if (stepNow.value == 2){
    if (form.value.isApprove == ""){
      return  proxy.$modal.msgError("请选择是否通过审核");
    }
    verifyQualification(form.value).then(res => {
      if (res.code == 200){
        proxy.$modal.msgSuccess("审核成功")
      }else {
        isShowQua.value = false
        return proxy.$modal.msgError("审核失败")
      }
    })
    stepNow.value += 1
    // 发送请求进行资质的上链
  }
}
function auditForm(){
  isShowQua.value = false
  stepNow.value = 1
}

getIndustryTag().then(res => {
  options.value = res.data
})

getList()
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.container {
  display: flex;
  align-items: flex-start;
}

.form-container {
  flex: 1;
}

.image-container {
  margin-left: 20px;
}

</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>