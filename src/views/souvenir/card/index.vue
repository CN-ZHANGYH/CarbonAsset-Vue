<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="星数等级" prop="level">
        <el-input
          v-model="queryParams.level"
          placeholder="请输入星数等级"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-input
          v-model="queryParams.category"
          placeholder="请输入分类"
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
          v-hasPermi="['souvenir:card:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['souvenir:card:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['souvenir:card:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['souvenir:card:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="纪念卡ID" align="center" prop="id" />
      <el-table-column label="星数等级" align="center" prop="level" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="图标" align="center" prop="url" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.url" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" prop="category" />
      <el-table-column label="积分" align="center" prop="credit" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['souvenir:card:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['souvenir:card:remove']">删除</el-button>
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

    <!-- 添加或修改纪念卡数据对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="cardRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select-v2
          v-model="form.category"
          :options="option"
          style="width: 100%"
          ></el-select-v2>
        </el-form-item>
        <el-form-item label="星数等级" prop="level">
          <el-input v-model="form.level" placeholder="请输入星数等级" />
        </el-form-item>
        <el-form-item label="积分数量" prop="credit">
          <el-input v-model="form.credit" placeholder="请输入积分数量" />
        </el-form-item>
        <el-form-item label="图标" prop="url">
          <el-upload class="avatar-uploader"
                     action=""
                     :http-request="uploadCard"
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
  </div>
</template>

<script setup name="Card">
import {listCard, getCard, delCard, addCard, updateCard, uploadCardImg} from "@/api/souvenir/card";
import {getCurrentInstance, reactive, ref} from "vue";
import {getCategoryList} from "@/api/souvenir/category";

const { proxy } = getCurrentInstance();

const cardList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const file = ref(null)
const imageUrl = ref("")
const option = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    level: null,
    name: null,
    description: null,
    url: null,
    category: null
  },
  rules: {
    level: [
      { required: true, message: "星数等级不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    category: [
      { required: true, message: "分类不能为空", trigger: "blur" }
    ],
    credit: [
      { required: true,message: "积分不能为空",trigger: "blur"}
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询纪念卡数据列表 */
function getList() {
  loading.value = true;
  listCard(queryParams.value).then(response => {
    cardList.value = response.rows;
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
    level: null,
    name: null,
    description: null,
    url: null,
    category: null
  };
  proxy.resetForm("cardRef");
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
  title.value = "添加纪念卡数据";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCard(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改纪念卡数据";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["cardRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCard(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCard(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除纪念卡数据编号为"' + _ids + '"的数据项？').then(function() {
    return delCard(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('souvenir/card/export', {
    ...queryParams.value
  }, `card_${new Date().getTime()}.xlsx`)
}

getList();


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
function uploadCard(file) {
  uploadCardImg(file).then(res => {
    if (res.code == 200){
      imageUrl.value = res.imgUrl
      form.value.url = res.imgUrl
      proxy.$modal.msgSuccess("上传成功")
    }
  }).catch(error => {
    proxy.$modal.msgError("上传失败")
  })
}


getCategoryList().then(res => {
  option.value = res.data
})
</script>

<style>
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