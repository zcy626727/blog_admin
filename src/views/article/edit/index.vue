<template>
  <div class="edit-body">
    <div class="editer-info">
      <div class="d1">
        <label>标题</label>
        <div class="title">
          <el-input
            size="medium"
            placeholder="标题"
            v-model="articleInfo.title"
            clearable
          ></el-input>
        </div>
      </div>
      <div class="d2">
        <label>类别</label>
        <div class="category">
          <el-select
            v-model="articleInfo.category"
            placeholder="选择类别"
            clearable
          >
            <el-option
              v-for="(item, index) in categoryOptions"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.name
              }}</span>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="tags">
      <label>标签</label>
      <div class="select">
        <el-select
          v-model="articleInfo.tagsValue"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择文章标签"
        >
          <el-option
            v-for="item in tagsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="markdown">
      <mavon-editor
        v-model="articleInfo.markdownValue"
        :toolbars="toolbars"
      ></mavon-editor>
    </div>

    <div class="btns">
      <el-button ref="uploadBtn" @click="handleUpdateBtn">
        上传封面
      </el-button>
      <el-button ref="saveBtn" @click="handleSaveBtn">保存</el-button>
      <el-button ref="publishBtn" @click="handlePublishBtn($event)">
        发布
      </el-button>
    </div>

    <el-dialog :visible.sync="dialogUploadVisible" title="上传封面" center>
      <div class="upload">
        <el-upload
          ref="upload"
          :on-remove="handleUploadRemove"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-progress="handleUploadProgress"
          :on-exceed="handleUploadexceed"
          :before-upload="handleBeforeUpload"
          :auto-upload="false"
          class="upload-demo"
          action="#"
          :limit="1"
          :file-list="fileList"
          list-type="picture-card"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button ref="confirmBtn" type="primary" @click="dialogVisible = false">点击上传</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "articleEdit",
  data() {
    return {
      dialogUploadVisible: false,
      fileList: [
        // {
        //   name: "food.jpeg",
        //   url:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
      ],
      articleInfo: {
        markdownValue: "",
        tagsValue: [],
        category: "",
        title: "",
      },
      categoryOptions: [
        { id: "1", name: "java" },
        { id: "2", name: "go" },
      ],
      tagsOptions: [
        {
          value: "HTML",
          label: "HTML",
        },
        {
          value: "CSS",
          label: "CSS",
        },
        {
          value: "JavaScript",
          label: "JavaScript",
        },
      ],
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
    };
  },
  methods: {
    test() {
      alert(this.articleInfo.markdownValue);
    },
    handleUploadRemove(file, fileList) {
      debugger;
      alert("移除");
    },
    handleUploadSuccess(response, file, fileList) {
      alert("上传成功");
    },
    handleUploadError(err, file, fileList) {
      alert("上传失败");
    },
    handleUploadProgress(event, file, fileList) {
      alert("文件上传");
    },
    handleUploadexceed(files, fileList) {
      debugger;
      //files, fileList
      alert(this.fileList);
      alert(files);
    },
    handleBeforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleUpdateBtn(event) {
      this.dialogUploadVisible = true
      // var target =this.$refs.uploadBtn.$el;
      // target.classList.add("el-button--success");
      // target.classList.remove("el-button--default");
      // target.innerHTML = "更换封面";
    },
    handleConfirmBtn(){
      // this.$refs.upload.submit();
      //上传成功代码
      var target =this.$refs.uploadBtn.$el;
      target.classList.add("el-button--success");
      target.classList.remove("el-button--default");
      target.innerHTML = "更换封面";
      this.dialogUploadVisible = false

    },
    handleSaveBtn(event) {
      //保存上传的图片
      
      var target = this.$refs.saveBtn.$el;
      
      target.classList.add("el-button--success");
      target.classList.remove("el-button--default");
      target.innerHTML = "重新保存";
    },
    handlePublishBtn(event) {
      alert(event);
      var target = this.$refs.publishBtn.$el;
      
      target.classList.add("el-button--success");
      target.classList.remove("el-button--default");
      target.innerHTML = "已发布";
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-body {
  margin: 20px;
  display: flex;
  flex-direction: column;

  .editer-info {
    margin-right: 40px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .d1 {
      width: 60%;
    }
    .d2 {
      width: 25%;
    }

    label {
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box !important;
    }
    .title,
    .category {
      margin-left: 40px;
      line-height: 40px;
      position: relative;
      font-size: 14px;
      width: 100%;
      .el-input,
      .el-select {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 100%;
        line-height: 40px;
      }
    }
  }

  .markdown {
    margin-bottom: 40px;
  }

  .tags {
    margin-bottom: 30px;
    label {
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box !important;
    }

    .select {
      margin-left: 40px;
      line-height: 40px;
      position: relative;
      font-size: 14px;
      width: 100%;
    }

    .el-select {
      position: relative;
      font-size: 14px;
      display: inline-block;
      width: 97.5%;
      line-height: 40px;
    }
  }

  .btns {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: center;

    .el-button {
      width: 30%;
    }
  }

  .el-dialog {
    .upload {
      .upload-demo {
        text-align: center;
      }
    }
  }
}
</style>
