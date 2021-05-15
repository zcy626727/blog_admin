<template>
  <div class="container">
    <div class="filter">
      <div class="common">
        <div class="input-items">
          <div>
            <label>标题</label>
            <div class="input-item">
              <el-input
                size="medium"
                placeholder="标题"
                v-model="listQuery.title"
                clearable
              ></el-input>
            </div>
          </div>
          <div>
            <label>类别</label>
            <div class="input-item">
              <el-select
                v-model="listQuery.categoryId"
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
          <div>
            <label>创建时间</label>
            <div class="input-item" style="margin-left: 70px">
              <el-date-picker
                style="width: 100%"
                v-model="listQuery.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :change="dateChange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </div>
          </div>
        </div>

        <div class="reset">
          <el-button icon="el-icon-refresh" type="primary" @click="handleReset"
            >重置</el-button
          >
        </div>
      </div>

      <div class="tags-search">
        <div class="tags">
          <label>标签</label>
          <div class="select">
            <el-drag-select
              class="drag-select"
              v-model="listQuery.tags"
              style="width: 500px"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in tagsOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-drag-select>
          </div>
        </div>
        <div class="search">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >
            搜索
          </el-button>
        </div>
      </div>
    </div>

    <div class="list">
      <el-table
        fit
        border
        :key="tableKey"
        row-key="date"
        :data="listData"
        v-loading="loading.listLoading"
        @sort-change="sortChange"
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" sortable="custom" width="75px">
          <template slot-scope="{ $index }">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="标题" min-width="20">
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="category" label="分类" min-width="20">
          <template slot-scope="{ row }">
            <span>{{ findNameInCateforyOptions(row.cId) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="des" label="描述" min-width="20">
          <template slot-scope="{ row }">
            <span>{{ row.des }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="tags" label="标签" min-width="20">
          <template #default="scope">
            <div class="tag-list">
              <el-tag v-for="(item, index) in scope.row.tags" :key="index">{{
                item.name
              }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="time" label="创建日期" width="93px">
          <template slot-scope="{ row }">
            <span>{{ row.createTime.split(" ")[0] }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="time" label="更新日期" width="93px">
          <template slot-scope="{ row }">
            <span>{{ row.updateTime.split(" ")[0] }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="150px"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-button type="primary" size="mini" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              v-if="!row.deleted"
              size="mini"
              type="danger"
              @click="handleDelete(row, true, $index)"
            >
              删除
            </el-button>
            <el-button
              v-if="row.deleted"
              size="mini"
              type="success"
              @click="handleDelete(row, false, $index)"
            >
              恢复
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="发布"
          width="67px"
          class-name="small-padding fixed-width"
          align="center"
        >
          <template slot-scope="{ row}">
            <el-switch
            @change="handleModifyStatus(row)"
              v-model="row.published"
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
      class=""
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="ListInfo.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import ElDragSelect from "@/components/DragSelect";
import {putStatus, getTagList, getCategoryList, getArticleList } from "@/api/article";
import { dateFormat } from "@/utils/index";
export default {
  name: "articleList",
  components: {
    ElDragSelect,
  },
  data() {
    return {
      categoryOptions: [],
      tableKey: "0",
      loading: {
        listLoading: false,
      },
      //列表信息
      ListInfo: {
        total: 0,
        page: 1,
        size: 10,
      },
      //列表数据
      listData: [],
      //筛选条件
      listQuery: {
        createTime: null,
        title: null,
        tags: [],
        categoryId: null,
      },
      //标签值
      tagsOptions: [],
    };
  },
  methods: {
    init() {
      this.loading.listLoading = true;
      this.handleSearch();
      this.getCategorysA();
      this.getTagsA();
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
    getCategorysA() {
      getCategoryList()
        .then((response) => {
          const { data } = response;
          this.categoryOptions = data.categoryList;
        })
        .catch((error) => {
          this.$message.error("获取分类失败");
        });
    },

    getArticlesA(query) {
      getArticleList(query)
        .then((response) => {
          const { data } = response;
          let articleList = data.articleList;
          this.listData = articleList;
          this.ListInfo.total = data.total;
          this.loading.listLoading = false;
        })
        .catch((error) => {
          this.loading.listLoading = false;
          this.$message.error("获取文章列表失败");
        });
    },
    //清空筛选项
    handleReset() {
      this.listQuery.createTime = null;
      this.listQuery.title = null;
      this.listQuery.categoryId = null;
      this.listQuery.tags = [];
    },
    //搜索按钮
    handleSearch() {
      var query = {
        categoryId: this.listQuery.categoryId,
        title: this.listQuery.title,
        createTimeFrom: null,
        createTimeTo: null,
        tags: this.listQuery.tags,
        page: this.ListInfo.page,
        size: this.ListInfo.size,
      };
      let dates = this.listQuery.createTime;
      // debugger;
      if (dates && dates.length == 2) {
        query["createTimeFrom"] = dates[0];
        query["createTimeTo"] = dates[1];
      }

      this.getArticlesA(query);

      // alert(this.listQuery.createTime);
    },
    //发布/草稿 状态切换
    handleModifyStatus(row, status) {
      let article = {
        published:row.published,
        id:row.id
      }
      putStatus(article)
    },
    //分页大小变化
    handleSizeChange(pageSize) {
      this.ListInfo.size = pageSize;
      this.handleSearch();
    },
    //删除按钮
    handleDelete(row, deleted) {
      let article = {
        deleted:deleted,
        id:row.id
      }
      putStatus(article)
        .then((response) => {
            const { data } = response;
            row.deleted = data.deleted
          })
          .catch((error) => {
            this.loading.listLoading = false;
            this.$message.error("文章删除失败");
          });
    },
    //页码变化
    handleCurrentChange(page) {
      this.ListInfo.page = page;
      this.handleSearch();
    },
    //编辑
    handleEdit(row) {
      this.$router.push({ path: "/article/edit", query: { id: row.id } });
    },
    //排序触发
    sortChange(data) {
      alert(data);
    },
    //日期
    dateChange(a) {
      alert("我出发啦");
    },
    findNameInCateforyOptions(cId) {
      let c_Options = this.categoryOptions;
      for (var i in c_Options) {
        if (c_Options[i].id == cId) {
          return c_Options[i].name;
        }
      }
      return "未知";
    },
  },
  computed: {},
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 20px;
  .filter {
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .reset,
    .search {
      width: 6.5%;
      .el-button {
        width: 100%;
      }
    }

    .common {
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .input-items {
        width: 86.9%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        > div {
          width: 30%;
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

        .input-item {
          margin-left: 40px;
          line-height: 40px;
          position: relative;
          font-size: 14px;
          width: 91%;

          .el-input,
          .el-select,
          .el-date-picker {
            position: relative;
            font-size: 14px;
            display: inline-block;
            width: 100% !important;
            line-height: 40px;
          }
        }
      }
    }

    .tags-search {
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .tags {
        width: 86.9%;
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
        .drag-select {
          position: relative;
          font-size: 14px;
          display: inline-block;
          width: 100% !important;
          line-height: 40px;
        }
      }
    }
  }

  .list {
    margin-bottom: 20px;
    .tag-list {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      .el-tag {
        margin-right: 5px;
        margin-bottom: 10px;
      }
    }
  }

  .el-pagination {
    text-align: center;
  }
}
</style>
