<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px" @close="close">
    <el-form ref="form" label-width="120px" :model="form">
      <el-form-item>
        <template #label>
          <el-tooltip :content="'提前告诉你的 AI 助手更多信息，或者模拟一轮对话，有助于更准确地回答'" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <span>预设消息</span>
        </template>
        <el-button type="dashed" @click="addInput">添加对话示例</el-button>
        <div v-for="(input, index) in form.presetMessages" :key="index">
          <template v-if="!(index % 2)">
            <div style="display: flex">
              <el-input v-model="input.content" class="add-input" clearable placeholder="提问" prefix-icon="el-icon-user" />
              <el-button circle class="add-btn" icon="el-icon-delete" type="danger" @click="removeInput(index)" />
            </div>
          </template>
          <template v-else>
            <el-input v-model="input.content" class="add-input" clearable placeholder="回答" prefix-icon="el-icon-chat-dot-round" />
          </template>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { addModel, editModel } from '@/api/model'

  export default {
    name: 'PresetDialog',
    data() {
      return {
        form: {
          isPublic: 0, // 是否公开 0公开 1私有
          name: '', // 名称
          avatar: '', // 头像
          description: '', // 简述
          detail: '', // 详细描述
          category: '', // 分类
          maxTokens: 1024, // 最大回复长度
          historyMessageNum: 10, // 历史消息数量
          repetitionPenalty: 0, // 重复惩罚
          temperature: 1, // 随机性
          systemMessage: '', // 系统设定
          presetMessages: [], // 预设消息
        },
        title: '预设',
        dialogFormVisible: false,
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
      }
    },
    created() {},
    mounted() {},
    methods: {
      showPreset(row) {
        this.form = Object.assign({}, row)
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { data } = await addModel(this.form)
            if (data) {
              this.$baseMessage('添加成功', 'success')
              this.$refs['form'].resetFields()
              this.dialogFormVisible = false
              this.$emit('fetch-data')
              this.form = this.$options.data().form
            } else {
              this.$baseMessage('添加失败', 'error')
            }
          } else {
            return false
          }
        })
      },
      addInput() {
        this.form.presetMessages.push({ role: 'user', content: '' }, { role: 'assistant', content: '' })
      },
      removeInput(index) {
        this.form.presetMessages.splice(index, 2)
      },
    },
  }
</script>
<style lang="scss" scoped>
  ::v-deep {
    .el-slider .el-slider__marks-text {
      word-break: keep-all;
    }
  }

  .add-input,
  .add-btn {
    margin-top: 10px;
    margin-right: 10px;
  }

  .add-input {
    width: 550px;
  }
</style>
