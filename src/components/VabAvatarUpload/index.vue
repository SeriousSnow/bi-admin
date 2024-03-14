<template>
  <el-upload
    action="#"
    :before-upload="beforeAvatarUpload"
    class="avatar-uploader"
    :http-request="handleUpload"
    name="avatar"
    :on-change="handleChange"
    :show-file-list="false"
  >
    <img v-if="imageUrl" class="avatar" :src="imageUrl" />
    <template v-else>
      <i v-if="loading" class="el-icon-loading avatar-uploader-icon"></i>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </template>
  </el-upload>
</template>

<script>
  import { fileUpload } from '@/api/model'

  export default {
    name: 'VabAvatarUpload',
    props: {
      imgUrl: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        imageUrl: '',
        loading: false,
        uploadType: 'model',
      }
    },
    watch: {
      imgUrl(newVal, oldVal) {
        this.imageUrl = newVal
      },
    },
    methods: {
      // 获取base64图片
      getBase64(img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
      },
      // 上传状态改变时触发
      handleChange(file) {
        if (file.status === 'ready') {
          this.loading = true
          return
        }
        if (file.status === 'success') {
          // 从响应中获取此url
          this.getBase64(file.raw, (base64Url) => {
            this.imageUrl = base64Url
            this.loading = false
          })
          // this.imageUrl = file.url
        }
        if (file.status === 'fail') {
          this.loading = false
          this.$baseMessage('上传失败', 'error')
        }
      },
      // 上传之前
      beforeAvatarUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
          this.$baseMessage('你只能上传JPG或PNG类型文件!', 'error')
          file.status = 'error'
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isLt2M) {
          this.$baseMessage('图像必须小于10MB!', 'error')
          file.status = 'error'
          return false
        }
        if (file.size === 0) {
          this.$baseMessage('所选信息中存在空文件或目录，请重新选择', 'warning')
          file.status = 'error'
          return false
        }
        return true
      },
      async handleUpload(file) {
        const fd = new FormData()
        fd.append('uploadFile', file.file)
        fd.append('bucket', 'bi-icon')
        fd.append('objectName', this.uploadType)
        this.loading = true
        // 文件上传请求
        const res = await fileUpload(fd)
        if (res.code === 200) {
          this.loading = false
          // file.onSuccess()
          this.$baseMessage('图片上传成功', 'success')
          this.$baseEventBus.$emit('model-on-success', res.data)
        } else {
          this.loading = false
          this.$baseMessage('图片上传失败[T_T]', 'error')
        }
        // .then((res) => {
        //   this.fileList = []
        //   this.loading = false
        //   file.onSuccess()
        //   this.$baseMessage('图片上传成功', 'success')
        // })
        // .catch(() => {
        //   this.loading = false
        //   file.onError()
        //   this.$baseMessage('图片上传失败[T_T]', 'error')
        // })
      },
    },
  }
</script>
<style lang="scss" scoped>
  ::v-deep {
    .el-upload {
      width: 60px;
      height: 60px;
      border: 1px dashed #d9d9d9;
      border-radius: 10%;
      cursor: pointer;
      display: flex;

      &:hover {
        border-color: #409eff;
      }
    }
  }

  .avatar-uploader-icon {
    font-size: 18px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;

    &:hover {
      color: #409eff;
    }
  }
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 10%;
  }
</style>
