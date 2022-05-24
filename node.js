//1. 导入fs模块
const fs = require("fs")
// 2.调用fs.readFile（）文件读取方法
 
fs.readFile("./default.conf","utf8",function(err,dataStr){
    // 如果读取成功，则err的值为null，dataStr会显示例1.txt的文本内容
    // 如果读取失败，err的值为错误对象，展示出错误信息，dataStr的值为undefined
    console.log(err)
    console.log("------")
    console.log(dataStr)
 
})