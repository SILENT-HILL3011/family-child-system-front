<template>
  <div class="tool-page">
    <!-- 返回按钮 -->
    <div class="page-header">
      <h2>实用育儿工具</h2>
      <el-button type="primary" @click="$router.back()">返回</el-button>
    </div>

    <div class="tool-list">
      <div class="tool-card" v-for="tool in toolList" :key="tool.name">
        <div class="tool-info">
          <h3>{{ tool.name }}</h3>
          <p>适用平台：{{ tool.platform }}</p>
          <p>核心功能：{{ tool.coreFunc }}</p>
          <p>适配亮点：{{ tool.brightPoint }}</p>
          <p class="pay-type">是否付费：{{ tool.isPay }}</p>
        </div>
        <div class="tool-btn">
          <button @click="goTool(tool)">进入使用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToolList } from '../../api/util';

export default {
  name: "Tools",
  data() {
    return {
      toolList: []
    };
  },
  mounted() {
    this.loadTools();
  },
  methods: {
    async loadTools() {
      const res = await getToolList();
      if (res.code === 200) {
        this.toolList = res.data;
      }
    },
    goTool(tool) {
      if (tool.name === "儿童健康问诊") {
        this.$router.push("/health");
      } else if (tool.name === "过敏原查询") {
        this.$router.push("/allergen");
      } else if (tool.name === "营养素查询") {
        this.$router.push("/nutrient");
      } else if (tool.name === "育儿知识库") {
        this.$router.push("/knowledge");
      }
    }
  }
};
</script>

<style scoped>
.tool-page {
  padding: 30px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
}

.tool-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.tool-card {
  width: 350px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.tool-info h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.tool-info p {
  font-size: 14px;
  color: #555;
  margin: 4px 0;
}

.pay-type {
  color: #009c53;
  font-weight: bold;
}

.tool-btn {
  margin-top: 15px;
  text-align: right;
}

.tool-btn button {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>