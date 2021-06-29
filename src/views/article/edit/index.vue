<template>
<el-scrollbar>
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
            filterable
            v-model="articleInfo.cId"
            placeholder="选择类别"
            clearable
          >
            <el-option
              v-for="(item, index) in categoryOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
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
          v-model="articleInfoTags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择文章标签"
        >
          <el-option
            v-for="item in tagsOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="des">
      <label>描述</label>
      <div class="des-input">
        <el-input
          type="textarea"
          maxlength="100"
          :autosize="{ minRows: 2 }"
          placeholder="描述内容"
          show-word-limit
          v-model="articleInfo.des"
        >
        </el-input>
      </div>
    </div>

    <div class="markdown">
      <mavon-editor
        :autofocus="false"
        ref="md"
        v-model="articleInfo.content"
        :toolbars="toolbars"
        @imgAdd="markdownImgAdd"
        @imgDel="markdownImgDel"
      ></mavon-editor>
    </div>

    <div class="btns">
      <el-button
        :type="status.saveTextType"
        ref="saveBtn"
        :loading="loading.saveBtn"
        @click="handleSaveBtn"
        >{{ status.saveText }}</el-button
      >
      <el-button
        :type="status.uploadTextType"
        ref="uploadBtn"
        :loading="loading.uploadBtn"
        @click="handleUploadBtn"
      >
        {{ status.uploadText }}
      </el-button>
      <el-button
        :type="articleInfo.published ? 'success' : 'primary'"
        ref="publishBtn"
        :loading="loading.publishBtn"
        @click="handlePublishBtn($event)"
      >
        {{ status.publishText }}
      </el-button>
    </div>

    <el-dialog :visible.sync="dialogUploadVisible" title="上传封面" center>
      <div class="upload">
        <el-upload
          ref="uploadAvatar"
          :on-remove="handleUploadRemove"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-progress="handleUploadProgress"
          :on-exceed="handleUploadexceed"
          :before-upload="beforeAvatarUpload"
          class="upload-demo"
          accept="image/jpeg,image/jpg,image/png"
          action="http://localhost:8000/article/uploadAvatar"
          :with-credentials="true"
          :data="{ id: articleInfo.id }"
          name="avatar"
          :headers="articleInfo.avatar.headers"
          :limit="1"
          :file-list="articleInfo.avatar.fileList"
          list-type="picture-card"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</el-scrollbar>
  
</template>

<script>
import {
  uploadIllustration,
  removeIllustration,
  removeAvatar,
  putStatus,
  getArticleById,
  saveTags,
  saveArticle,
  getTagList,
  getCategoryList,
} from "@/api/article";

export default {
  name: "articleEdit",
  data() {
    return {
      img_file: {},
      loading: {
        confirmBtn: false,
        saveBtn: false,
        uploadBtn: false,
        publishBtn: false,
      },
      dialogUploadVisible: false,
      status: {
        saveText: "保存",
        saveTextType: "primary",
        uploadText: "上传封面",
        uploadTextType: "primary",
        publishText: "发布",
      },
      articleInfo: {
        content: "",
        tagsValue: [],
        cId: "",
        title: "",
        des: "",
        id: null,
        avatar: {
          fileList: [],
          headers: {},
        },
      },
      categoryOptions: [],
      tagsOptions: [],
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
    init() {
      this.getCategorysA();
      this.getTagsA();
    },
    verification() {
      if (this.articleInfo.title == "") {
        this.$message.warning("标题为空");
        return false;
      }

      if (this.articleInfo.cId == "") {
        this.$message.warning("请选择分类");
        return false;
      }

      if (this.articleInfo.content == "") {
        this.$message.warning("内容为空");
        return false;
      }

      return true;
    },
    getCategorysA() {
      getCategoryList()
        .then((response) => {
          const { data } = response;
          this.categoryOptions = data.categoryList;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    getArticleByIdA(id) {
      getArticleById(id)
        .then((response) => {
          const { article } = response.data;
          // this.articleInfo = data.article;avatarUrl

          var tags = article.tags;
          var tagRes = [];
          for (var i in tags) {
            tagRes.push(tags[i].id);
          }

          this.articleInfo.content = article.content;
          this.articleInfo.cId = article.cId;
          this.articleInfo.title = article.title;
          this.articleInfo.des = article.des;
          if (article.avatar != "无" && article.avatar != null) {
            this.articleInfo.avatar.fileList = [
              {
                name: article.avatar,
                url: article.avatarUrl,
              },
            ];
            this.status.uploadTextType = "success";
            this.status.uploadText = "更换封面";
          }
          this.articleInfo.id = article.id;
          this.articleInfo.tagsValue = tagRes;
          this.articleInfo.published = article.published;
          this.articleInfo.deleted = article.deleted;

          this.status.saveTextType = "success";
          this.status.saveText = "更新";
        })
        .catch((error) => {
          this.$message.error("获取文章信息失败");
        });
    },
    getTagsA() {
      getTagList()
        .then((response) => {
          const { data } = response;

          this.tagsOptions = data.tagList;
        })
        .catch((error) => {
          this.$message.error("获取标签失败");
        });
    },
    saveArticleA(condition) {
      //保存文章信息
      var tags = this.articleInfo.tagsValue;
      //封装请求体参数
      var article = {
        title: this.articleInfo.title,
        des: this.articleInfo.des,
        content: this.articleInfo.content,
        cid: this.articleInfo.cId,
        tags: [],
      };

      for (let k in condition) {
        article[k] = condition[k];
      }

      for (let i in tags) {
        article.tags.push({ id: tags[i] });
      }

      if (this.articleInfo.id != null) {
        article.id = this.articleInfo.id;
      }

      saveArticle(article)
        .then((response) => {
          const { data } = response;
          this.articleInfo.id = data.article.id;
          this.loading.saveBtn = false;
          this.$message.success("保存文章成功");
          this.status.saveText = "更新";
          this.status.saveTextType = "success";
        })
        .catch((error) => {
          this.loading.saveBtn = false;
          this.$message.error(error.message);
          this.status.saveText = "重新保存";
          this.status.saveTextType = "danger";
        });
    },
    getOptionByid(id) {
      for (var i in this.tagsOptions) {
        var item = this.tagsOptions[i];
        if (item.id == id) {
          return i;
        }
      }
      return null;
    },
    markdownImgAdd(pos, $file) {
      if (!this.articleInfo.id) {
        this.$message.warning("请先保存文章")
        //从md中删除图片
        this.$refs.md.$refs.toolbar_left.$imgDelByFilename($file._name)
        this.$refs.md
        return;
      }
      // 缓存图片信息
      this.img_file[pos] = $file;
      //第一步.将图片上传到服务器.
      let formdata = new window.FormData();
      formdata.append("id", this.articleInfo.id);
      formdata.append("picture", $file);

      uploadIllustration(formdata)
        .then((response) => {
          const { data } = response;
          this.$refs.md.$img2Url(pos, data.url);
          this.saveArticleA();
          this.$message.success(response.message);
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    markdownImgDel(pos) {
      if(!this.articleInfo.id){
        this.$message.warning("请先保存文章")
        return
      }
      delete this.img_file[pos];

      let name = pos[0].substring(pos[0].lastIndexOf("/") + 1);
      removeIllustration(this.articleInfo.id, name)
        .then((response) => {
          const { data } = response;

          this.$message.success(response.message);
          // this.$refs.md.$img2Url(pos, data.url);
        })
        .catch((error) => {

          this.$message.error(error.message);
        });
      return false;
    },
    handleUploadRemove(file, fileList) {

      if (!this.articleInfo.id || !this.articleInfo.avatar.fileList[0].name) {
        return;
      }
      removeAvatar(
        this.articleInfo.id,
        this.articleInfo.avatar.fileList[0].name
      )
        .then((response) => {
          const { data } = response;

          this.$message.success(response.message);
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    handleUploadSuccess(response, file, fileList) {

      if (response.code == 20000) {
        this.$message.success(response.message);
        this.articleInfo.avatar.fileList = [
          {
            name: response.data.name,
            url: response.data.url,
          },
        ];
        this.status.uploadTextType = "success";
        this.status.uploadText = "更换封面";
      } else {
        this.$message.error(response.message);
        this.articleInfo.avatar.fileList = [];
      }
    },
    handleUploadError(err, file, fileList) {
      this.$message.error(err.message);
      this.articleInfo.avatar.fileList = [];
    },
    //文件上传中
    handleUploadProgress(event, file, fileList) {},
    handleUploadexceed(files, fileList) {

      this.$message.error("封面只能上传一个");
    },
    beforeAvatarUpload(file) {
      if (this.articleInfo.id == null || this.articleInfo.id.length < 18) {
        this.$message.error("请先保存再上传封面");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!isLt2M) {
        this.$message.error("上传封面大小不能超过 3MB!");
      }

      return isLt2M;
    },
    handleUploadBtn(event) {
      this.dialogUploadVisible = true;
    },
    handleConfirmBtn(forName) {
      this.$refs.uploadAvatar.submit();
      this.dialogVisible = false;
      this.dialogUploadVisible = false;
    },
    handleSaveBtn(event) {
      this.loading.saveBtn = true;
      this.status.saveText = "正在保存";

      if (!this.verification()) {
        this.status.saveText = "保存";
        this.loading.saveBtn = false;
        return;
      }

      var tags = this.articleInfo.tagsValue;

      var tagNames = [];
      for (var i = 0; i < tags.length; i++) {
        if (tags[i].startsWith("+")) {
          tagNames.push(tags[i].substr(1));
          this.articleInfo.tagsValue.splice(i, 1);
          i--;
        }
      }
      //处理标签
      if (tagNames.length != 0) {
        //保存标签，并替换当前选中标签的id
        saveTags(tagNames)
          .then((response) => {

            this.getTagsA();
            const { data } = response;
            var a = this.articleInfo.tagsValue;
            for (var i in data.tagList) {
              this.articleInfo.tagsValue.push(data.tagList[i].id);
            }

            this.saveArticleA();
          })
          .catch((error) => {
            this.loading.saveBtn = false;
            this.$message.error("保存新标签失败");
          });
      } else {
        this.saveArticleA();
      }
    },
    handlePublishBtn(event) {
      this.loading.publishBtn = true;
      // var target = this.$refs.publishBtn.$el;

      if (!this.verification()) {
        this.loading.publishBtn = false;
        return false;
      }
      let article = {
        published: !this.articleInfo.published,
        id: this.articleInfo.id,
      };
      putStatus(article).then((response) => {
        const { data } = response;
        this.articleInfo.published = data.published;
        if (this.status.publishText == "已发布") {
          //发布->草稿
          this.status.publishText = "发布";
        } else {
          //草稿->发布
          this.status.publishText = "已发布";
        }
        this.loading.publishBtn = false;
      });
    },
  },
  computed: {
    articleInfoTags: {
      get() {

        var temp = [];
        let tagsValue = this.articleInfo.tagsValue;
        for (var i in tagsValue) {
          temp.push(tagsValue[i]);
        }
        return temp;
      },
      set(tagIds) {

        var temp = [];
        for (var index in tagIds) {
          var option = this.getOptionByid(tagIds[index]);
          if (option == null) {
            //没有此id
            temp.push("+" + tagIds[index]);
            this.tagsOptions.push({
              id: "+" + tagIds[index],
              name: tagIds[index],
            });
          } else {
            temp.push(tagIds[index]);
          }
        }
        this.articleInfo.tagsValue = temp;
      },
    },
  },
  created() {
    this.init();

    if (this.$route.query.id) {
      this.articleInfo.id = this.$route.query.id;
      this.getArticleByIdA(this.$route.query.id);
    }
  },
};
</script>

<style lang="scss" scoped>
.edit-body {
  min-width: 880px;
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

    .v-note-wrapper {
      max-height: 630px;
    }
    .fullscreen {
      max-height: 100% !important;
    }
  }

  .tags {
    margin-bottom: 20px;
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
      width: 99.5%;
    }

    .el-select {
      position: relative;
      font-size: 14px;
      display: inline-block;
      width: 97.5%;
      line-height: 40px;
    }
  }

  .des {
    margin-bottom: 20px;

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

    .des-input {
      margin-left: 40px;
      line-height: 40px;
      position: relative;
      font-size: 14px;
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
