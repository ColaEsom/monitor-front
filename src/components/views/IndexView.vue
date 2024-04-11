<template>
  <div>
     <!-- 新增任务按钮 -->
    <el-button type="primary" @click="backIndex" style="float: right; margin-bottom: 20px;">返回首页</el-button>
    <el-button type="primary" @click="showDialog = true" style="float: right; margin-bottom: 20px; margin-right: 20px">新增任务</el-button>

    <el-table :data="tasks" style="width: 100%; clear: both;">
      <el-table-column prop="product" label="产品名称" />
      <el-table-column prop="workstation" label="工位ID"/>
      <el-table-column prop="demandNumber" label="需求数量"/>
      <el-table-column prop="completedNumber" label="已完成数量"/>
      <el-table-column :formatter="formatDate" label="创建时间"/>
      <el-table-column :formatter="translateStatus" label="状态"/>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="{row}">
          <el-button type="primary" size="small" @click="editTask(row)">编辑</el-button>
          <el-popconfirm
              width="220"
              confirm-button-text="OK"
              cancel-button-text="No, Thanks"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="Are you sure to delete this?"
              @confirm="deleteTask(row)"
            >
              <template #reference>
                <el-button type="danger" size="small"> 删除 </el-button>
              </template>
            </el-popconfirm>
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

    <el-dialog v-model="showDialog" title="新增任务" width="50%">
      <el-form @submit.prevent="submitTask" ref="taskForm">
        <el-form-item label="产品名称：">
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
    </el-dialog>

    <el-dialog v-model="showUpdateDialog" title="任务详情" width="50%">
      <el-form ref="taskForm">
        <!-- <el-form-item label="id">
          <el-input v-model="currentTask.id" required></el-input>
        </el-form-item> -->
        <el-form-item label="产品名称：">
          <el-input v-model="currentTask.product" required></el-input>
        </el-form-item>
        <el-form-item label="工位ID：">
          <el-input v-model="currentTask.workstation" required></el-input>
        </el-form-item>
        <el-form-item label="需求数量：">
          <el-input type="number" v-model.number="currentTask.demandNumber" required></el-input>
        </el-form-item>
        <el-form-item label="已完成数量：">
          <el-input type="number" v-model.number="currentTask.completedNumber" required></el-input>
        </el-form-item>
        <!-- 时间和状态字段不包括在表单中 -->
        <el-form-item>
          <el-button type="primary" @click="submitUpdateTask">更新任务</el-button>
        </el-form-item>
      </el-form>
  </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElPagination, ElForm, ElFormItem, ElInput, ElButton, ElDialog } from 'element-plus';
import { useRouter } from 'vue-router';

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElPagination,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElDialog
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
    const showDialog = ref(false); // 控制对话框显示的变量
    const showUpdateDialog = ref(false); // 控制对话框显示的变量
    const currentTask = ref({}); // 当前选中的任务数据
    const router = useRouter();

    const loadTaskPage = (page, pageSize) => {
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
        showDialog.value = false; // 关闭弹窗
        loadTaskPage(current.value, size.value); // 重新加载当前页以显示更新
      })
      .catch(error => {
        console.error('Error:', error);
        alert('任务分配失败，请重试。');
      });
    };

    const submitUpdateTask = () => {
      const taskData = {
        id: currentTask.value.id,
        product: currentTask.value.product,
        workstation: currentTask.value.workstation,
        demandNumber:  currentTask.value.demandNumber,
        completedNumberL: currentTask.value.demandNumber
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
        showUpdateDialog.value = false; // 关闭弹窗
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

    const editTask = (task) => {
      currentTask.value = { ...task }; // 深拷贝当前行的数据
      showUpdateDialog.value = true; // 显示弹窗
    };

    const backIndex = () => {
        router.push('/');
    };
    
    const deleteTask = (task) => {
      fetch(`/mo/task/delete/${task.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        alert('成功删除！');
        loadTaskPage(current.value, size.value); // 重新加载当前页以显示更新
      })
      .catch(error => {
        console.error('Error:', error);
        alert('删除失败，请重试。');
      });
    };

    return {
      product,
      workstation,
      demandNumber,
      tasks,
      pages,
      size,
      current,
      submitTask,
      showDialog, // 返回控制对话框显示的变量
      loadTaskPage,
      translateStatus,
      formatDate,
      handlePageChange,
      editTask,
      currentTask,
      showUpdateDialog,
      submitUpdateTask,
      backIndex,
      deleteTask,
    };
  },
};
</script>