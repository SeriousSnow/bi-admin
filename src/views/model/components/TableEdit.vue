<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px" @close="close">
    <el-form ref="form" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <vab-avatar-upload v-if="form.avatar" :img-url="form.avatar" />
        <vab-avatar-upload v-else />
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-tooltip :content="'全局设定助手的职责、行为、能力、语气等（system prompt）'" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <span>设定</span>
        </template>
        <el-input
          v-model="form.systemMessage"
          :maxlength="1024"
          placeholder="请介绍下您的AI助手"
          :rows="3"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类" style="width: 120px">
          <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model.trim="form.description" autocomplete="off" />
      </el-form-item>
      <el-form-item label="详情" prop="detail">
        <el-input v-model.trim="form.detail" autocomplete="off" :rows="4" type="textarea" />
      </el-form-item>
      <el-form-item label="可见范围" prop="isPublic">
        <el-radio-group v-model="form.isPublic">
          <el-radio :label="0">公开</el-radio>
          <el-radio :label="1">私有</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="historyMessageNum">
        <template #label>
          <el-tooltip :content="'每次发消息时，关联的历史对话消息数。相当于给 AI 记忆，0 表示每次都是全新的对话'" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <span>关联历史消息数</span>
        </template>
        <el-slider v-model="form.historyMessageNum" :marks="{ 0: '0', 20: '20', 40: '40' }" :max="40" :min="0" />
      </el-form-item>
      <el-form-item label="回复最大词数" prop="maxTokens">
        <el-slider v-model="form.maxTokens" :marks="{ 0: '0', 1024: '1024', 2048: '2048' }" :max="2048" :min="0" :step="2" />
      </el-form-item>
      <el-form-item label="回复随机性" prop="temperature">
        <el-slider v-model="form.temperature" :marks="{ 0: '精确', 1: '平衡', 2: '强随机' }" :max="2" :min="0" :step="0.01" />
      </el-form-item>
      <el-form-item prop="repetitionPenalty">
        <template #label>
          <el-tooltip :content="'值越大出现重复词的概率越低'" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <span>重复词惩罚</span>
        </template>
        <el-slider v-model="form.repetitionPenalty" :marks="{ '-2': '复读机', 0: '平衡', 2: '少重复' }" :max="2" :min="-2" :step="0.01" />
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
  import VabAvatarUpload from '@/components/VabAvatarUpload'

  export default {
    name: 'TableEdit',
    components: { VabAvatarUpload },
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
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          category: [{ required: true, trigger: 'blur', message: '请选择分类' }],
        },
        title: '',
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
    mounted() {
      this.$baseEventBus.$on('model-on-success', (e) => (this.form.avatar = e))
    },
    beforeDestroy() {
      this.$baseEventBus.$off('model-on-success')
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
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
            if (this.title === '添加') {
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
            } else if (this.title === '编辑') {
              const { data } = await editModel(this.form)
              if (data) {
                this.$baseMessage('修改成功', 'success')
                this.$refs['form'].resetFields()
                this.dialogFormVisible = false
                this.$emit('fetch-data')
                this.form = this.$options.data().form
              } else {
                this.$baseMessage('修改失败', 'error')
              }
            }
          } else {
            return false
          }
        })
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
</style>
