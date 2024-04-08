<template>
  <div>
    <el-table :data="tasks" style="width: 100%">
      <el-table-column prop="product" label="产品ID" />
      <el-table-column prop="workstation" label="工位ID"/>
      <el-table-column prop="demandNumber" label="需求数量"/>
      <el-table-column prop="completedNumber" label="已完成数量"/>
      <el-table-column :formatter="formatDate" label="创建时间"/>
      <el-table-column :formatter="translateStatus" label="状态"/>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default>
        <el-button link type="primary" size="small" @click="editTask">
          编辑
        </el-button>
        <el-button link type="primary" size="small" @click="deleteTask">
          删除
        </el-button>
      </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @update:current-page="handlePageChange"
      :current-page="current"
      :page-size="size"
      layout="prev, pager, next"
      :total="pages * size">
    </el-pagination>

    <el-form @submit.prevent="submitTask" ref="taskForm">
      <el-form-item label="产品ID：">
        <el-input v-model="product" required></el-input>
      </el-form-item>
      <el-form-item label="工位ID：">
        <el-input v-model="workstation" required></el-input>
      </el-form-item>
      <el-form-item label="请输入今日产品生产数量：">
        <el-input type="number" v-model.number="demandNumber" required></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitTask">分配任务</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElPagination, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElPagination,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  setup() {
    const product = ref('');
    const workstation = ref('');
    const demandNumber = ref(0);
    const tasks = ref([]);
    const pages = ref(0);
    const size = ref(10);
    const current = ref(1);
    const total = ref();

    const loadTaskPage = (page, pageSize) => {
      console.log(page);
      console.log(pageSize);
      fetch(`/mo/task/page?page=${page}&size=${pageSize}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          total.value = data.total;
          tasks.value = data.records;
          pages.value = data.pages;
          current.value = data.current;
          size.value = data.size;
        })
        .catch(error => console.error('Error:', error));
    };

    const submitTask = () => {
      const taskData = {
        product: product.value,
        workstation: workstation.value,
        demandNumber: demandNumber.value,
      };

      fetch('/mo/task/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        alert('任务已成功分配！');
        loadTaskPage(current.value, size.value); // 重新加载当前页以显示更新
      })
      .catch(error => {
        console.error('Error:', error);
        alert('任务分配失败，请重试。');
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

    const translateStatus = (status) => {
      return status.status === 'submit' ? '已提交' : status.status === 'finish' ? '完成' : '未知状态';
    };


  const handlePageChange = (newPage) => {
      console.log('newPage',newPage);
      loadTaskPage(newPage, size.value);
    };

    onMounted(() => {
      // 初始化页面，加载第一页数据
      loadTaskPage(current.value, size.value);
    });

    const handleClick = () => {
      console.log('click')
    }

    return {
      product,
      workstation,
      demandNumber,
      tasks,
      pages,
      size,
      current,
      submitTask,
      loadTaskPage,
      translateStatus,
      formatDate,
      handlePageChange,
      handleClick,
    };
  },
};
</script>