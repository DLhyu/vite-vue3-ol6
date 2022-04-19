<template>
  <div>
    <el-dialog :title="dialogTitle"
               :before-close="handleClose"
               top="5vh"
               v-model="dialogVisible"
               :modal="false"
               width="32%"
               append-to-body>
               <div :style="styleDiv" id='drawFallingDiv'>
                 <img :src="imgStr" :width="width" :height="height">
                 <!-- <span class="legend">
                    <li v-for="item in legends"
                      :key="item.label">
                      <div :style="{ backgroundColor: item.value || item.color}">{{item.label}}</div>
                    </li>
                 </span> -->
               </div>
               <template #footer>
                <span class="dialog-footer">
                  <el-button icon="el-icon-time" @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" icon="el-icon-time" @click="publicProduct">下 载</el-button>
                </span>
              </template>
               <!-- <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-time" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" icon="el-icon-time" @click="publicProduct">下 载</el-button>
               </span> -->
    </el-dialog>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { defineComponent, ref, reactive, toRefs } from "vue";

export default defineComponent({
  name: 'PreviewModel',
  setup(){
    const previewVar = reactive({
      styleDiv: {width:'560px',height:'550px', 'text-align': 'center'},
      imgStr: '',
      dialogVisible: false,
      dialogTitle: '',
      loadingInstance: '',
      picName: '',
      width: '560',
      height: '500'
    })
    const handleMethods = reactive({
      filterData: (params) => {
        previewVar.imgStr = params.dataUrl
        previewVar.picName = params.picName
        previewVar.dialogVisible = !previewVar.dialogVisible
        previewVar.dialogTitle = '导出预览'
      },
      publicProduct: () => {
        const drawFallingDiv = document.getElementById("drawFallingDiv")
        html2canvas(drawFallingDiv).then(function(canvas) {
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            previewVar.dialogVisible = false
            handleMethods.downloadImage(previewVar.picName, dataUrl)
        });
      },
      downloadImage: (filename, dataUrl) => {
        if (!window.navigator.msSaveOrOpenBlob) {
          // in browsers that support the download attribute
          // a link is created and a programmatic click will trigger the download
          const element = document.createElement("a");
          element.setAttribute("href", dataUrl);
          element.setAttribute("download", filename);
          element.style.display = "none";
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        } else {
          // for MS browsers convert dataUrl to Blob
          const byteString = atob(dataUrl.split(",")[1]);
          const mimeString = dataUrl
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });

          // download file
          window.navigator.msSaveOrOpenBlob(blob, filename);
        }
      },
      handleClose: (done) => {
        done()
      }
    })
    return {
      ...toRefs(previewVar),
      ...toRefs(handleMethods)
    }
  },
})

</script>
<style scoped>
:deep().el-dialog__body{
  height: 700px;
  padding: 0px 20px;
}
:deep().el-dialog__header {
    padding: 10px 20px 10px;
}
</style>