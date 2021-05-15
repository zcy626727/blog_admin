<template>
  <div class="category">
    <div class="c-edit">
      <div class="c-edit-item">
        分类级别：
        <el-select v-model="categoryInfo.level" placeholder="选择分类级别">
          <el-option
            v-for="item in levels"
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
        <el-select v-model="categoryInfo.parent_id" placeholder="请选择父分类">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.started == 1 ? "开启" : "禁用"
            }}</span>
          </el-option>
        </el-select>
      </div>

      <el-button type="primary" @click="addCategory" round>添加</el-button>
    </div>
    <div class="c-show">
      <el-table
        v-loading="loading.listLoading"
        :data="categoryList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" width="60px">
          <template slot-scope="{ $index }">
            <span>{{ $index+1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="ID" width="170px">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" class-name="status-col" label="状态">
          <template slot-scope="{ row }">
            <el-tag :type="row.started | statusFilter">
              {{ row.started ? "开启" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="文章数">
          <template slot-scope="{ row }">
            <span>{{ row.articleNum }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="级别">
          <template slot-scope="{ row }">
            <span>{{ row.level }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="200px" label="类别名">
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

        <el-table-column
          label="启用"
          width="67px"
          class-name="small-padding fixed-width"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-switch
              @change="handleModifyStatus(row)"
              v-model="row.started"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import {
  updateCategory,
  saveCategory,
  getCategoryListPlus,
} from "@/api/article";
export default {
  name: "tags-manage",
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: "primary",
        false: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      levels: [
        { name: "主标题", value: 0 },
        { name: "一级标题", value: 1 },
      ],
      categoryInfo: {
        name: null,
        level: null,
        parent_id: null,
      },
      pageInfo: {
        total: 0,
        current: 1,
        size: 10,
      },
      categoryList: [],
      loading: {
        addLoading: false,
        listLoading: false,
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getCategoryListPlusA();
    },
    handleCurrentChange(current){
      this.pageInfo.current = current
      debugger
      this.getCategoryListPlusA()
    },
    handleSizeChange(size){
      debugger
      this.pageInfo.size = size
      
      this.getCategoryListPlusA()
    },
    getCategoryListPlusA() {
      //发送请求获取全部标签 todo
      getCategoryListPlus(this.pageInfo.current, this.pageInfo.size)
        .then((response) => {
          const { data } = response;
          for(let i in data.categoryList ){
            data.categoryList[i]['edit'] = false
            data.categoryList[i]['originalTitle'] = data.categoryList[i].name
          }
          this.categoryList = data.categoryList;
          this.pageInfo.total = data.total;
          this.loading.listLoading = false;
        })
        .catch((error) => {
          this.loading.loading.listLoading = false;
          this.$message.error("标签获取失败");
        });
    },
    addCategory() {
      if (!this.addVerification()) {
        return false;
      }
      this.loading.addLoading = true;
      let categoryEntity = {
        name: this.categoryInfo.name,
        level: this.categoryInfo.level,
        fId: this.categoryInfo.parent_id,
      };
      // debugger;
      saveCategory(categoryEntity)
        .then((response) => {
          this.$message.success(response.message);
          this.loading.addLoading = false;
          this.addReset();
          this.getCategoryListPlusA();
        })
        .catch((error) => {
          this.loading.addLoading = false;
          this.$message.error(error.message);
        });
    },
    handleModifyStatus(row) {
      let categoryOfArticle = {
        id: row.id,
        started: row.started,
      };
      debugger
      updateCategory(categoryOfArticle)
        .then((response) => {
          this.$message.success(response.message);
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    
    cancelEdit(row) {
      row.name = row.originalTitle;
      row.edit = false;
      this.$message({
        message: "取消操作",
        type: "warning",
      });
    },
    confirmEdit(row) {
      row.edit = false;
      let category = {
        id:row.id,
        name:row.name
      }
      updateCategory(category)
        .then((response) => {
          row.originalTitle = row.name;
          this.$message.success(response.message)
        })
        .catch((error) => {
          this.$message.error(error.message)
        });
    },
    addReset() {
      this.categoryInfo.name = null;
      this.categoryInfo.level = null;
      this.categoryInfo.parent_id = null;
    },
    addVerification() {
      let cInfo = this.categoryInfo;
      if (cInfo.name == null || cInfo.name.length <= 0) {
        this.$message.error("分类名为空");
        return false;
      }

      if (cInfo.name.length >= 30) {
        this.$message.error("分类名长度不能超过30");
        return false;
      }

      if (cInfo.level == null) {
        this.$message.error("分类级别未设置");
        return false;
      }

      if (cInfo.parent_id == null) {
        cInfo.parent_id = 0;
      }
      return true;
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

  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>