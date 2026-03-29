<template>
  <div class="family-moment-page">
    <!-- 头部返回 -->
    <div class="page-header">
      <el-button @click="goBack">← 返回</el-button>
      <h2>家庭朋友圈</h2>
    </div>

    <!-- 发布动态卡片 -->
    <div class="publish-box">
      <h3>发布新动态</h3>
      <el-input
        v-model="momentContent"
        type="textarea"
        rows="4"
        placeholder="分享家里日常、暖心话、育儿心得..."
        style="margin:15px 0"
      />
      <el-button type="primary" @click="handlePublish">立即发布</el-button>
    </div>

    <!-- 动态列表 -->
    <div class="moment-list">
      <div class="moment-item" v-for="item in messageList" :key="item.msgId">
        <div class="user-info">
          <div class="default-avatar">👤</div>
          <div class="user-text">
            <div class="user-name">家庭成员：{{ item.memberName }}</div>
            <div class="publish-time">{{ item.createTime }}</div>
          </div>
        </div>

        <div class="moment-text">{{ item.content }}</div>

        <div class="btn-group">
          <el-button text icon="el-icon-thumb" @click="handleLike(item)">
            点赞 ({{ item.likeCount || 0 }})
          </el-button>
          <el-button text icon="el-icon-chat-line-round" @click="toggleComment(item)">
            评论 ({{ item.commentCount || 0 }})
          </el-button>
        </div>

        <!-- 评论区域 -->
        <div v-if="commentTarget === item" class="comment-wrap">
          <!-- 评论列表 -->
          <div class="comment-list">
            <div class="comment-item" v-for="comment in commentList" :key="comment.commentId">
              <div class="comment-info">
                <span class="comment-content">
                  <!-- ====================== -->
                  <!-- 这里我加好了回复格式 ✅ -->
                  <!-- ====================== -->
                  {{ comment.content }}
                  <span v-if="comment.replyToId" style="color:#999; font-size:12px; margin-left:6px;">
                    回复【{{ getReplyContent(comment.replyToId) }}】
                  </span>
                </span>
                <span class="comment-time">{{ comment.commentTime }}</span>
              </div>
              <el-button text size="small" @click="toggleReply(comment)">回复</el-button>

              <!-- 回复输入框 -->
              <div v-if="replyTarget?.commentId === comment.commentId" class="reply-input-box">
                <el-input
                  v-model="replyContent"
                  type="textarea"
                  rows="2"
                  placeholder="回复这条评论..."
                />
                <div class="reply-btn-box">
                  <el-button size="small" @click="cancelReply">取消</el-button>
                  <el-button type="primary" size="small" @click="handleSendReply">发送</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 发表评论 -->
          <div class="comment-input-box">
            <el-input
              v-model="commentContent"
              type="textarea"
              rows="2"
              placeholder="写下你的评论..."
            />
            <div class="comment-btn-box">
              <el-button size="small" @click="cancelComment">取消</el-button>
              <el-button type="primary" size="small" @click="handleSendComment">发送</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getMessageList,
  publishFamilyMessage,
  likeMessage,
  searchComment,
  applyToMessage,
  applyToComment
} from '../../api/family'

const router = useRouter()
const momentContent = ref('')
const messageList = ref([])

// 评论主区域
const commentTarget = ref(null)
const commentContent = ref('')
const commentList = ref([])

// 回复评论
const replyTarget = ref(null)
const replyContent = ref('')

// ======================
// 我加的：根据 replyToId 找到被回复的内容 ✅
// ======================
const getReplyContent = (replyToId) => {
  if (!replyToId) return ''
  const target = commentList.value.find(c => c.commentId === replyToId)
  return target ? target.content : ''
}

// 返回
const goBack = () => {
  router.go(-1)
}

// 加载动态列表
onMounted(() => {
  loadMessageList()
})

// 切换动态的评论区
watch(commentTarget, (val) => {
  if (val) {
    loadCommentList(val.messageId)
  } else {
    commentList.value = []
    replyTarget.value = null
  }
})

// 加载动态列表
const loadMessageList = async () => {
  try {
    const res = await getMessageList()
    if (res.code === 200) {
      messageList.value = res.data || []
    }
  } catch (e) {
    ElMessage.error('加载失败')
  }
}

// 加载评论列表
const loadCommentList = async (messageId) => {
  try {
    const res = await searchComment({ messageId })
    if (res.code === 200) {
      commentList.value = res.data || []
    }
  } catch (e) {
    ElMessage.error('加载评论失败')
  }
}

// 发布动态
const handlePublish = async () => {
  if (!momentContent.value.trim()) {
    ElMessage.warning('请输入内容')
    return
  }
  try {
    const res = await publishFamilyMessage({ content: momentContent.value })
    if (res.code === 200) {
      ElMessage.success('发布成功')
      momentContent.value = ''
      loadMessageList()
    }
  } catch (e) {
    ElMessage.error('发布失败')
  }
}

// 点赞
const handleLike = async (item) => {
  try {
    const res = await likeMessage({ messageId: item.messageId })
    if (res.code === 200) {
      ElMessage.success('点赞成功')
      item.likeCount = (item.likeCount || 0) + 1
    }
  } catch (e) {
    ElMessage.error('点赞失败')
  }
}

// 展开/收起评论
const toggleComment = (item) => {
  commentTarget.value = commentTarget.value === item ? null : item
  commentContent.value = ''
  replyTarget.value = null
}

// 取消评论
const cancelComment = () => {
  commentContent.value = ''
  commentTarget.value = null
}

// 发送评论
const handleSendComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论')
    return
  }
  try {
    const res = await applyToMessage({
      messageId: commentTarget.value.messageId,
      content: commentContent.value
    })
    if (res.code === 200) {
      ElMessage.success('评论成功')
      commentContent.value = ''
      commentTarget.value.commentCount = (commentTarget.value.commentCount || 0) + 1
      loadCommentList(commentTarget.value.messageId)
    }
  } catch (e) {
    ElMessage.error('评论失败')
  }
}

// 展开回复
const toggleReply = (comment) => {
  if (replyTarget.value?.commentId === comment.commentId) {
    replyTarget.value = null
    replyContent.value = ''
  } else {
    replyTarget.value = comment
    replyContent.value = ''
  }
}

// 取消回复
const cancelReply = () => {
  replyTarget.value = null
  replyContent.value = ''
}

// 发送回复
const handleSendReply = async () => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复')
    return
  }
  try {
    const res = await applyToComment({
      commentId: replyTarget.value.commentId,
      content: replyContent.value
    })
    if (res.code === 200) {
      ElMessage.success('回复成功')
      replyContent.value = ''
      replyTarget.value = null
      loadCommentList(commentTarget.value.messageId)
    }
  } catch (e) {
    ElMessage.error('回复失败')
  }
}
</script>

<style scoped>
.family-moment-page {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}
.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}
.publish-box {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}
.publish-box h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}
.moment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.moment-item {
  background: #fff;
  padding: 22px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}
.default-avatar {
  width: 44px;
  height: 44px;
  background: #409eff;
  color: #fff;
  font-size: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-name {
  font-weight: 500;
  font-size: 15px;
  color: #333;
}
.publish-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
.moment-text {
  font-size: 15px;
  line-height: 1.7;
  color: #444;
  margin-bottom: 18px;
}
.btn-group {
  display: flex;
  gap: 24px;
}

/* 评论区域 */
.comment-wrap {
  margin-top: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}
.comment-list {
  margin-bottom: 12px;
}
.comment-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
.comment-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.comment-content {
  font-size: 14px;
  color: #333;
}
.comment-time {
  font-size: 12px;
  color: #999;
}
.comment-input-box {
  border-top: 1px solid #eee;
  padding-top: 12px;
}
.comment-btn-box {
  text-align: right;
  margin-top: 6px;
}

/* 回复框 */
.reply-input-box {
  margin-top: 8px;
  padding: 10px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #eee;
}
.reply-btn-box {
  text-align: right;
  margin-top: 6px;
}
</style>