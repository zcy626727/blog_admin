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
              <el-select v-model="listQuery.category" placeholder="选择类别" clearable>
                <el-option
                  v-for="(item,index) in categorys"
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
          <div>
            <label>时间</label>
            <div class="input-item">
              <el-date-picker
                v-model="listQuery.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :change="dateChange"
                format="yyyy-MM-DD"
              >
              </el-date-picker>
            </div>
          </div>
        </div>

        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleReset()"
        >
          重置
        </el-button>
      </div>

      <div class="tags">
        <el-drag-select
          class="drag-select"
          v-model="listQuery.tags"
          style="width: 500px"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in ElDragSelectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-drag-select>
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

    <div class="list">
      <el-table
        fit
        border
        :key="tableKey"
        row-key="date"
        :data="listData"
        v-loading="listLoading"
        @sort-change="sortChange"
        style="width: 100%"
      >
        <el-table-column label="序号" sortable="custom" width="80">
          <template slot-scope="{ $index }">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="20">
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="describe" label="描述" min-width="20">
          <template slot-scope="{ row }">
            <span>{{ row.describe }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="tags" label="标签" min-width="20">
          <template #default="scope">
            <div class="tag-list">
              <el-tag v-for="(item, index) in scope.row.tags" :key="index">{{
                item
              }}</el-tag>
              <el-tag v-for="(item, index) in scope.row.tags" :key="index">{{
                item
              }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="time" label="日期" width="150px">
          <template slot-scope="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-button type="primary" size="mini" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              v-if="row.status != 'published'"
              size="mini"
              type="success"
              @click="handleModifyStatus(row, 'published')"
            >
              发布
            </el-button>
            <el-button
              v-if="row.status != 'draft'"
              size="mini"
              @click="handleModifyStatus(row, 'draft')"
            >
              草稿
            </el-button>
            <el-button
              v-if="row.status != 'deleted'"
              size="mini"
              type="danger"
              @click="handleDelete(row, $index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      class=""
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    >
    </el-pagination>
  </div>
</template>

<script>
import ElDragSelect from "@/components/DragSelect";
export default {
  name: "articleList",
  components: {
    ElDragSelect,
  },
  data() {
    return {
      categorys: [{id:'1', name: "java" }, {id:'2', name: "go" }],
      tableKey: "0",
      listLoading: false,
      listData: [
        {
          id: "1",
          title: "色批是怎样炼成的",
          date: "2000-7-27 05:12:30",
          describe: "我家门前有一颗枣树，另一颗还是枣树",
          tags: ["java", "python", "js", "go"],
          status: "published",
        },
        {
          id: "1",
          title: "色批是怎样炼成的2",
          date: "2000-7-27",
          describe: "我家门前有一颗枣树，另一颗还是枣树",
          tags: ["java", "python", "js", "go"],
          status: "draft",
        },
      ],
      //筛选条件
      listQuery: {
        date: null,
        title: "",
        tags: ["java"],
        category: "",
      },
      //标签值
      ElDragSelectValue: ["Apple", "Banana", "Orange"],
      ElDragSelectOptions: [
        {
          value: "Apple",
          label: "Apple",
        },
        {
          value: "Banana",
          label: "Banana",
        },
        {
          value: "Orange",
          label: "Orange",
        },
        {
          value: "Pear",
          label: "Pear",
        },
        {
          value: "Strawberry",
          label: "Strawberry",
        },
      ],
    };
  },
  methods: {
    //清空筛选项
    handleReset() {
      this.listQuery.date = null;
      this.listQuery.title = '';
      this.listQuery.category=''
      this.listQuery.tags = ''
    },
    //搜索按钮
    handleSearch() {
      debugger;
      alert(this.listQuery.date);
      debugger;
      alert(this.listQuery.date[0].getDate());
      alert(this.listQuery.date[0].getDay());
      alert(this.listQuery.date[0].getFullYear());
    },
    //发布/草稿 状态切换
    handleModifyStatus(row, status) {
      row.status = status;
    },
    //分页页码变化
    handleSizeChange(pageSize) {},
    //删除按钮
    handleDelete(row, index) {},
    //分页变化
    handleCurrentChange() {},
    //编辑
    handleEdit(row) {},
    //排序触发
    sortChange(data) {
      alert(data);
    },
    //日期
    dateChange(a) {
      alert("我出发啦");
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  .filter {
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .common {
      margin-top: 10px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .input-items {
        width: 86.8%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        div {
          width: 300px;
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

          .el-input {
            position: relative;
            font-size: 14px;
            display: inline-block;
            width: 100%;
            line-height: 40px;
          }
        }
      }
    }

    .tags {
      // width: 90%;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .drag-select {
        width: 90% !important;
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
