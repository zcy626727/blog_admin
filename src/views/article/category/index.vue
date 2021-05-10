<template>
  <div class="category">
    <div class="c-edit">
      <div class="c-edit-item">
        分类级别：
        <el-select v-model="categoryInfo.type" placeholder="选择分类级别">
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="c-edit-item">
        分类名：
        <el-input
          type="text"
          placeholder="请输入分类名"
          v-model="categoryInfo.name"
          maxlength="13"
          show-word-limit
        >
        </el-input>
      </div>

      <div class="c-edit-item">
        父分类：
        <el-select
          v-model="categoryInfo.parent_type_id"
          placeholder="请选择父分类"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.id
            }}</span>
          </el-option>
        </el-select>
      </div>

      <el-button type="primary" @click="addCategory" round>添加</el-button>
    </div>
    <div class="c-show">
      <el-table
        v-loading="listLoading"
        :data="categoryList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" width="80">
          <template slot-scope="{ $index }">
            <span>{{ $index }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" class-name="status-col" label="状态">
          <template slot-scope="{ row }">
            <el-tag :type="row.status | statusFilter">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="文章数">
          <template slot-scope="{ row }">
            <span>{{ row.article_num }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="类型">
          <template slot-scope="{ row }">
            <span>{{ row.type == 0 ? "一级标题" : "二级标题" }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="200px" label="标题">
          <template slot-scope="{ row }">
            <template v-if="row.edit">
              <el-input v-model="row.name" class="edit-input" size="small" />
              <el-button
                class="cancel-btn"
                size="small"
                icon="el-icon-refresh"
                type="warning"
                @click="cancelEdit(row)"
              >
                取消
              </el-button>
            </template>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check"
              @click="confirmEdit(row)"
            >
              确定
            </el-button>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit = !row.edit"
            >
              编辑
            </el-button>

            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="row.edit = !row.edit"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "tags-manage",
  filters: {
    statusFilter(status) {
      const statusMap = {
        正常: "success",
        禁止: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      types: [
        { name: "主标题", value: "0" },
        { name: "一级标题", value: "1" },
      ],
      categoryInfo: {
        name: "",
        type: "",
        parent_type_id: "",
      },
      categoryList: [
        {
          id: "1",
          status: "正常",
          originalTitle: "色批超能力",
          name: "色批超能力",
          edit: false,
          article_num: "3",
          type: "0",
        },
        {
          id: "2",
          status: "禁止",
          originalTitle: "色批超能力",
          name: "色批超能力",
          edit: false,
          article_num: "4",
          type: "1",
        },
      ],
      listLoading: false,
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    async getCategoryList() {
      //发送请求获取全部标签 todo
      this.listLoading = false;
    },
    addCategory() {
      debugger;
      this.categoryInfo;
    },
    cancelEdit(row) {
      row.name = row.originalTitle;
      row.edit = false;
      this.$message({
        message: "重新赋值",
        type: "warning",
      });
    },
    confirmEdit(row) {
      row.edit = false;
      row.originalTitle = row.name;
      this.$message({
        message: "编辑完成",
        type: "success",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.category {
  margin: 20px;
  .c-edit {
    text-align: center;
    margin-bottom: 20px;
    color: #606266;
    font-size: 14px;
    font-weight: 700;

    .c-edit-item {
      display: inline;
    }
    .el-input,
    .el-select {
      margin-right: 2%;
      width: 14rem;
    }
  }

  .c-show {
    .edit-input {
      padding-right: 100px;
    }
    .cancel-btn {
      position: absolute;
      right: 15px;
      top: 10px;
    }
  }
}
</style>