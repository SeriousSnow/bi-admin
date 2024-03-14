<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form ref="form" :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-select v-model="queryForm.category" placeholder="请选择分类" style="width: 120px">
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryForm.title" placeholder="搜索模型" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" native-type="submit" type="primary" @click="handleQuery">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="handlReset">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column show-overflow-tooltip type="selection" width="55" />
      <el-table-column label="序号" min-width="75px" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="100px" prop="name" show-overflow-tooltip />
      <el-table-column label="头像" min-width="100px">
        <template #default="{ row }">
          <el-image v-if="imgShow && row.avatar" :preview-src-list="imageList" :src="row.avatar" />
          <div v-else style="height: 60px"></div>
        </template>
      </el-table-column>
      <el-table-column label="分类" min-width="100px" prop="category" />
      <el-table-column label="描述" min-width="200px" prop="description" show-overflow-tooltip />
      <!-- <el-table-column label="状态" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tooltip class="item" :content="row.status" effect="dark" placement="top-start">
            <el-tag :type="row.status | statusFilter">
              {{ row.status }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" show-overflow-tooltip width="180px">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/table'
  import { getModelList, delModel } from '@/api/model'
  import TableEdit from './components/TableEdit'

  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger',
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        categoryOptions: [
          { value: '实用工具', label: '实用工具' },
          { value: '文案创作', label: '文案创作' },
          { value: '领域专家', label: '领域专家' },
          { value: '编程导航', label: '编程导航' },
          { value: '知识学习', label: '知识学习' },
          { value: '知名人物', label: '知名人物' },
          { value: '兴趣推荐', label: '兴趣推荐' },
          { value: '生活指南', label: '生活指南' },
          { value: '休闲娱乐', label: '休闲娱乐' },
          { value: '其他', label: '其他' },
        ],
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          // 模型搜索值
          name: '',
          // 模型分类(默认空值为“热门推荐”，即全部模型)
          category: '',
        },
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.fetchData()
    },
    beforeDestroy() {},
    mounted() {},
    methods: {
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item, index) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
        // this.$router.push({ path: '/model/edit' })
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除此模型吗？此操作不可逆', null, async () => {
            await delModel(row.id)
            this.$baseMessage('删除成功', 'success')
            this.fetchData()
          })
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      handlReset() {
        this.queryForm.name = ''
        this.queryForm.category = ''
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        // const { data, totalCount } = await getList(this.queryForm)
        const res = await getModelList(this.queryForm)
        const { result, total } = res.data
        this.list = result
        const imageList = []
        result.forEach((item, index) => {
          imageList.push(item.avatar)
        })
        this.imageList = imageList
        this.total = total
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      testMessage() {
        this.$baseMessage('test1', 'success')
      },
      testALert() {
        this.$baseAlert('11')
        this.$baseAlert('11', '自定义标题', () => {
          /* 可以写回调; */
        })
        this.$baseAlert('11', null, () => {
          /* 可以写回调; */
        })
      },
      testConfirm() {
        this.$baseConfirm(
          '你确定要执行该操作?',
          null,
          () => {
            /* 可以写回调; */
          },
          () => {
            /* 可以写回调; */
          }
        )
      },
      testNotify() {
        this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
      },
    },
  }
</script>
