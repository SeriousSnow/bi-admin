import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess() {
  Vue.prototype.$baseMessage('复制成功', 'success')
}

function clipboardError() {
  Vue.prototype.$baseMessage('复制失败', 'error')
}

/**
 * @author https://bi-admin.com （不想保留author可删除）
 * @description 复制数据
 * @param text
 * @param event
 */
export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
