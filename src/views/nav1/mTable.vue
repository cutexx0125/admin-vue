<template>
  <div>
    <!-- 查询新增 工具条 -->
    <el-col :span="24" class="toolbar" style="padding-bottom:0px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
					<el-button type="primary" @click="getUsers()">查询</el-button>
				</el-form-item>
        <el-form-item>
					<el-button type="primary" @click.native="handleAdd">新增</el-button>
				</el-form-item>
      </el-form>
    </el-col>

    <!-- 列表 -->
    <el-table :data="users" highlight-current-row style="width: 100%;" 
    v-loading="listLoading" @selection-change="selsChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120" sortable></el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="100" sortable></el-table-column>
			<el-table-column prop="birth" label="生日" width="120" sortable></el-table-column>
			<el-table-column prop="addr" label="地址" min-width="160" sortable></el-table-column>
      <el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
    </el-table>

    <!-- 批量删除和分页 工具条 -->
    <el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" :page-size="20" :total="total" 
      style="float:right;" @current-change="handleCurrentChange">
			</el-pagination>
		</el-col>

    <!-- 编辑界面 -->
    <el-dialog title="编辑" :visible="editFormVisible" @close="closeDialog">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"
          value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
    </el-dialog>

    <!-- 新增界面 -->
    <el-dialog title="新增" :visible="addFormVisible" @close="closeDialog">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"
          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="addForm.addr"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button @click.native="addSubmit" :loading="addLoading" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api.js'

export default {
  name: 'mTable',
  data() {
    return {
      // 查询用户名
      filters: {
        name: ''
      },
      // 所有用户列表
      users: [],
      // 总数
      total: 0,
      // 页数
      page: 1,
      // 是否加载中
      listLoading: false,
      // 列表选中行
      sels: [],
      // 是否显示编辑页面
      editFormVisible: false,
      // 编辑界面数据
      editForm: {
        id: 0,
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: ''
      },
      editLoading: false,
      editFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      //新增界面数据
      addForm: {
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: ''
      }
    }
  },
  methods: {
    // 获取用户列表
    getUsers() {
      let params = {
        page: this.page,
        name: this.filters.name
      }
      this.listLoading = true
      getUserListPage(params).then(res => {
        this.total = res.data.total
        this.users = res.data.users
        this.listLoading = false
      })
    },
    // 性别显示转换
    formatSex(row, col) {
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知'
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    handleAdd() {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: ''
      }
    },
    // 删除
    handleDel(index, row) {
      this.$confirm('确定删除该记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let params = { id: row.id }
        removeUser(params).then(res => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getUsers
        })
      }).catch(() => {})
    },
    // 批量删除
    batchRemove() {
      var ids = this.sels.map(item => item.id).toString()
      this.$confirm('确定删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let params = { ids: ids }
        batchRemoveUser(params).then(res => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getUsers()
        })
      }).catch(() => {})
    },
    // 编辑完提交
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let params = Object.assign({}, this.editForm)
            editUser(params).then(res => {
              this.editLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs.editForm.resetFields()
              this.editFormVisible = false
              this.getUsers()
            })
          })
        }
      })
    },
    // 新增完提交
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let params = Object.assign({}, this.addForm)
            addUser(params).then(res => {
              this.addLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs.addForm.resetFields()
              this.addFormVisible = false
              this.getUsers()
            })
          }).catch(() => {})
        }
      })
    },
    // 关闭对话框
    closeDialog() {
      this.editFormVisible = false
      this.addFormVisible = false
    },
    // 选中行发生变化时
    selsChange(sels) {
      this.sels = sels
    },
    // 分页器页数变化
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    }
  },
  mounted() {
    this.getUsers()
  }
}
</script>

<style lang="less">
.toolbar {
  margin-top: 20px;
}
</style>