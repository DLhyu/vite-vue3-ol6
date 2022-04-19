export const dialogList = []

let zIndexMax = 2000

export const dialogWin = {
    data() {
        return {
            isVisible: true,
            isCollapse: false,
            dialogEl: null
        }
    },
    methods: {
        show() {
            this.isVisible = true
            let dialogEl = this.dialogEl         
            let dialogStyle = null   
            if(!dialogEl) {
                dialogEl = this.$el.querySelector('.el-dialog')
                const zIndex = this.$el.style.zIndex
                zIndexMax = zIndexMax<zIndex? zIndex : zIndexMax
                dialogEl.className = dialogEl.className+' '+'tool-panel'
                dialogStyle = dialogEl.style
                dialogStyle.zIndex = zIndex
                const parentEl = this.$el.parentNode
                parentEl.appendChild(dialogEl)
                parentEl.removeChild(this.$el)
                this.dialogEl = dialogEl
                return
            } else {
                dialogStyle = dialogEl.style
            }
            dialogStyle.display = 'block'
            if(dialogStyle.zIndex<zIndexMax) {         
                dialogStyle.zIndex = ++zIndexMax
            }
        },        
        toggle() {
            const dialogEl = this.dialogEl
            const bodyEl = dialogEl.querySelector('.el-dialog__body')
            const isCollapse = this.isCollapse
            bodyEl.style.display = isCollapse? 'block' : 'none'
            this.isCollapse = !isCollapse
        },
        beforeClose(done) {
            if(this.$emit('beforeClose', this)!==false) {
                this.dialogEl.style.display = 'none'                
                done()
            }
        }
    },
}
