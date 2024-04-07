<template>
    <div>
      <div>
        <label for="workstationInput">请输入工位ID：</label>
        <input id="workstationInput" v-model="workstation" @keyup.enter="fetchTaskInfo" placeholder="输入工位ID，按Enter查询">
      </div>
  
      <div v-if="task">
        <h2>任务详情</h2>
        <table>
          <thead>
            <tr>
              <th>产品ID</th>
              <th>工位ID</th>
              <th>需求数量</th>
              <th>已完成数量</th>
              <th>创建时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ task.product }}</td>
              <td>{{ task.workstation }}</td>
              <td>{{ task.demandNumber }}</td>
              <td><input type="number" v-model.number="task.completedNumber" /></td>
              <td>{{ formatDate(task.createTime) }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="updateTask">更新任务</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const workstation = ref('');
      const task = ref(null);
  
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
  
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('zh-CN', options).format(date).replace(/\//g, '-').replace(',', '');
      };
  
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