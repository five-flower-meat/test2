<template>
<div class="base-info">
  <h3>产品销售案例</h3>
  <div class="b-i-table">
    <el-table
      v-if="dataList"
      :data="dataList"
      row-key="salesId"
      :expand-row-keys="expands"
      style="width: 100%">
      <el-table-column
        v-if="false"
        label="产品ID" width="150"
        prop="salesId">
      </el-table-column>
      <el-table-column
        label="销售类型" width="150"
        prop="salesType">
      </el-table-column>
      <el-table-column
        label="组合产品" width="180"
        prop="composedProduct" :formatter="composedProductFn">
      </el-table-column>
      <el-table-column
        label="方案介绍"
        prop="scheme">
      </el-table-column>
      <el-table-column
        label="销售数量" width="100"
        prop="salesNumber">
      </el-table-column>
      <el-table-column
        label="操作" width="120"
        prop="name">
        <template slot-scope="operation">
          <div @click="openDetail(operation.$index, operation.row)" class="el-table__expand-icon blue">详细<i class="el-icon el-icon-arrow-right blue el-table__expand-icon--expanded"></i></div>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <p class="sale-type">
              <el-form-item label="销售类型：">
              <span>{{ props.row.salesType }}</span>
              </el-form-item>
              <el-form-item label="销售数量：">
                <span>{{ props.row.salesNumber }}</span>
              </el-form-item>
            </p>
            <p>
              <el-form-item class="key-point" label="创新点/借鉴点：">
                <span>{{ props.row.keypoint }}</span>
              </el-form-item>
            </p>
            <p v-if="props.row.fileNames">
              <el-form-item label="方案附件：">
                <span v-for="name in props.row.fileNames" :key="name" class="blue down" @click="dowloadFile(name.fileName, name.fileSaveName)">
                  <i class="el-icon-download"></i>{{name.fileName}}
                </span>
              </el-form-item>
            </p>
            <p>
              <el-form-item label-width="300" label="方案介绍：">
                <span>{{ props.row.scheme }}</span>
              </el-form-item>
            </p>
            <p>
              <el-form-item label-width="300" label="经验教训：">
                <span>{{ props.row.experience }}</span>
              </el-form-item>
            </p>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex';
import { FILE_TYPE_ID } from '@/config/index.js';
export default {
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      currIndex: -1,
      expands: [],
      uploadData: {
        fileTypeId: FILE_TYPE_ID.product,
        fileSaveName: '',
        fileName: ''
      }
    };
  },
  computed: {
    dataList() {
      if (this.data) {
        return this.getFileName();
      }
    }
  },
  methods: {
    getFileName() {
      var _this = this;
      if (this.data) {
        for (let i = 0; i < (this.data).length; i++) {
          if (_this.data[i].salesType === '0') {
            _this.data[i].salesType = '单品销售';
          } else if (_this.data[i].salesType === '1') {
            _this.data[i].salesType = '组合销售';
          }
          if (_this.data[i].fileInputId) {
            _this.queryElec({
              fileInputId: (_this.data[i].fileInputId)
            }).then((res) => {
              if (res.data.length > 0) {
                if (_this.data[i].fileInputId === res.data[0].fileInputId) {
                  let name = [];
                  for (let d in res.data) {
                    let obj = {
                      fileName: res.data[d].fileName,
                      fileSaveName: res.data[d].fileSaveName
                    };
                    name.push(obj);
                  }
                  _this.data[i].fileNames = name;
                  _this.uploadData = name;
                }
              }
            });
          }
        }
        return this.data;
      }
    },
    openDetail(index, row) {
      var id = row.salesId;
      if (id === this.expands[0]) {
        this.expands = [];
        this.currIndex = null;
      } else {
        this.expands = [id];
        this.currIndex = index;
      }
      this.currIndex = index;
    },
    composedProductFn(row, column, columnValue) {
      if (columnValue) {
        let composedStr = '';
        if (columnValue && columnValue.length > 0) {
          composedStr = columnValue.join('、');
        }
        return composedStr;
      } else {
        return '无';
      }
    },
    dowloadFile(name, path) {
      this.uploadData = {
        fileTypeId: FILE_TYPE_ID.product,
        fileSaveName: path,
        fileName: name
      };
      this.downloadUplodFile(this.uploadData);
    },
    ...mapActions([
      'queryElec',
      'downloadUplodFile'
    ])
  }
};
</script>

<style lang="scss">
.base-info {
  margin-top: 16px;
  padding-bottom: 16px;
  background: #fff;
  .down {display: inline-block; min-width: 366px; margin-right: 10px;}
  h3 {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    color: #262626;
    margin: 0;
    border-bottom: 1px #E6E6E6 solid;
    padding: 0px 32px;
  }
  .b-i-list {
    display: flex;
    flex-flow: wrap;
    padding: 10px 32px 0;
    li {
      height: 28px;
      line-height: 28px;
      font-size: 14px;
      width: 33%;
      color: #262626;
      span {
        color: #c0c0c0;
      }
    }
  }
  .b-i-table {
    padding: 32px;
  }
  .demo-table-expand {
    .el-form-item {margin-bottom: 0; display: flex;}
    .el-form-item__label {
      color: #c0c0c0;
      min-width: 82px;
    }
    .key-point .el-form-item__label {min-width: 116px;}
    p {
      min-height: 28px;
      line-height: 28px;
      color: #262626;
      .el-form-item__content {
        line-height: 1.5;
        margin-top: 9px;
        word-break: break-all;
      }
    }
    .sale-type {
      .el-form-item {
        width: 40%;
      }
    }
  }
  .el-table__expand-icon {
    width: 70px;
  }
  .el-table__body {
    .el-table_1_column_6 {
      display: none;
    }
  }
  .el-table {
    .el-table_1_column_6 {
      display: none;
    }
  }
}
</style>
