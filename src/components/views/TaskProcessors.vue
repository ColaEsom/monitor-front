<template>
  <div>
    <div>
      <el-form-item label="请输入工位ID：">
        <el-input v-model="workstation" placeholder="输入工位ID，按Enter查询" @keyup.enter="fetchTaskInfo"></el-input>
      </el-form-item>
    </div>

    <div v-if="task">
      <h2>任务详情</h2>
      <el-table :data="[task]" style="width: 100%">
        <el-table-column prop="product" label="产品ID"></el-table-column>
        <el-table-column prop="workstation" label="工位ID"></el-table-column>
        <el-table-column prop="demandNumber" label="需求数量"></el-table-column>
        <el-table-column label="已完成数量">
          <template #default="{row}">
            <el-input v-model.number="row.completedNumber" type="number"></el-input>
          </template>
        </el-table-column>
        <el-table-column :formatter="formatDate" label="创建时间"></el-table-column>
      </el-table>
      <el-button @click="updateTask">更新任务</el-button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
// eslint-disable-next-line
import { ElInput, ElFormItem, ElTable, ElTableColumn, ElButton } from 'element-plus';
import { useRoute } from 'vue-router';

export default {
  components: {
    ElInput,
    // ElForm,
    ElFormItem,
    ElTable,
    ElTableColumn,
    ElButton
  },
  setup() {
    const workstation = ref('');
    const task = ref(null);
    const route = useRoute();

    const fetchTaskInfo = () => {
      fetch(`/mo/info/${workstation.value}`)
        .then(response => response.json())
        .then(data => {
          task.value = data;
        })
        .catch(error => console.error('Error fetching task info:', error));
    };

    const updateTask = () => {
      if (!task.value || !task.value.id) {
        alert('无有效任务信息，无法更新。');
        return;
      }

      fetch('/mo/task/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task.value),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        alert('任务已成功更新！');
      })
      .catch(error => {
        console.error('Error updating task:', error);
        alert('任务更新失败，请重试。');
      });
    };

    const formatDate = (createTime) => {
      const date = new Date(createTime.createTime);
      if (isNaN(date.getTime())) {
        return '无效日期';
      }
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      return new Intl.DateTimeFormat('zh-CN', options).format(date).replace(/\//g, '-').replace(',', '');
    };

    onMounted(() => {
      workstation.value = route.query.username || '';
      fetchTaskInfo();
    });

    return {
      workstation,
      task,
      fetchTaskInfo,
      updateTask,
      formatDate,
    };
  },
};
</script>