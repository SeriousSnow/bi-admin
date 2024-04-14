<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <!-- <el-button icon="el-icon-plus" type="primary" @click="handleEdit">添加</el-button> -->
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.nickName" clearable placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column label="id" prop="id" show-overflow-tooltip />
      <el-table-column label="头像" prop="avatar" show-overflow-tooltip>
        <template #default="{ row }">
          <el-image v-if="row.avatar" :preview-src-list="imageList" :src="row.avatar" />
          <div v-else style="height: 60px"></div>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickName" show-overflow-tooltip />
      <el-table-column label="用户名" prop="userName" show-overflow-tooltip />
      <el-table-column label="邮箱" prop="email" show-overflow-tooltip />
      <el-table-column label="手机号" prop="phone" show-overflow-tooltip />

      <el-table-column label="状态" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-if="row.status === 0" type="success">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column label="修改时间" prop="datatime" show-overflow-tooltip /> -->
      <el-table-column label="操作" show-overflow-tooltip width="100">
        <template #default="{ row }">
          <!-- <el-button type="text" @click="handleEdit(row)">编辑</el-button> -->
          <!-- <el-button type="text" @click="handleDelete(row)">删除</el-button> -->
          <el-button v-if="row.status === 0" type="text" @click="handleStatus(row)">禁用</el-button>
          <el-button v-else type="text" @click="handleStatus(row)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { getUserList, setStatus } from '@/api/user'
  import Edit from './components/UserManagementEdit'

  export default {
    name: 'UserManagement',
    components: { Edit },
    data() {
      return {
        list: null,
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          nickName: '',
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      // handleEdit(row) {
      //   if (row.id) {
      //     this.$refs['edit'].showEdit(row)
      //   } else {
      //     this.$refs['edit'].showEdit()
      //   }
      // },
      handleStatus(row) {
        if (row.status === 0) {
          this.$baseConfirm('你确定要禁用当前项吗', null, async () => {
            const { message } = await setStatus({ id: row.id, status: 1 })
            this.$baseMessage(message, 'success')
            this.fetchData()
          })
        } else if (row.status === 1) {
          this.$baseConfirm('你确定要启用当前项吗', null, async () => {
            const { msg } = await setStatus({ id: row.id, status: 0 })
            this.$baseMessage(message, 'success')
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
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data } = await getUserList(this.queryForm)
        this.list = data.result
        const imageList = []
        data.result.forEach((item, index) => {
          imageList.push(item.avatar)
        })
        this.imageList = imageList
        this.total = data.total
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
