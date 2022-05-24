//关于使用settimeout的原因 一个堆栈中统一执行js的话 dom会统一渲染 所以使用setTimeout异步执行下一步操作

//动态加载资源
function loadStyle(url) {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(link)
}
//存放每个组件需要用到的参数和公共方法
class fixation {
    messagekey = {
        message_elmdata: [],
        top: [],
        topnum: 20,
        topheight: 50
    }
    Suspiciousnode = []
    Drawerkey = {
        zIndex: 9900,
    }
    fixdesign = {
        position: 'absolute'
    }
    bubbling(e) {
        if (window.event) {
            window.event.cancelBubble = true;
        } else {
            e.preventDefault();
        }
    }
    //初始化
    searchNode() {
        let node = document.body;
        //  判断是否存在子节点
        if (node.hasChildNodes()) {
            //  获取子节点
            let cnodes = node.childNodes;
            //  对子节点进行递归处理
            for (let i = 0; i < cnodes.length; i++) {
                if (this.resultisbot(cnodes[i])) {
                    this.Suspiciousnode.push(this.resultisbot(cnodes[i]));
                }
                this.reviewnode(cnodes[i])
            }
        }
    }
    //检索载入
    resultisbot(cnodes) {
        try {
            if (cnodes) {
                if (cnodes.attributes) {
                    return cnodes;
                }
            }
        }
        catch (err) {
            console.error(err.message);
        }
    }
    //检索dom节点下是否存在标识属性
    reviewnode(cnodes) {
        if (cnodes) {
            let cnodesnext = cnodes.childNodes;
            for (let reviewnodeitem = 0; reviewnodeitem < cnodes.childNodes.length; reviewnodeitem++) {
                this.resultisbot(cnodesnext[reviewnodeitem])
                this.reviewnode(cnodesnext[reviewnodeitem])
            }
        }
    }
    searchassignattr(attrkey, attrvalue) {
        let elmnode = '';
        let elmdata = [];
        this.Suspiciousnode.map(itme => {
            if (attrvalue) {
                if (itme.getAttribute(attrkey) && itme.getAttribute(attrkey) == attrvalue) {
                    elmnode = itme;
                }
            } else {
                if (itme.getAttribute(attrkey)) {
                    elmdata.push(itme);
                }
            }
        })
        if (attrvalue) {
            return elmnode;
        } else {
            return elmdata;
        }
    }
}
class elm_basics_class extends fixation {
    classlist = [{
        name: 'message',
        type: 'message',
        style: {}
    }];
    constructor() {
        super();
    }
    getclass(classname) {
        let setclass = '';
        this.classlist.map(itme => {
            if (itme.name == classname) {
                setclass = itme.name;
            }
        })
        return setclass;
    }
}
class elm extends elm_basics_class {
    constructor() {
        console.log(Array.from(arguments), '组') //后续做按需加载
        super();
        this.searchNode();
        // console.log(this.Suspiciousnode,'检测的页面所有节点')
        loadStyle('./style/default.css');//异步加载css
        loadStyle('./style/livingexample.css');
        loadStyle('./style/strange.css');
    }
    Drawer({ placement = 'bottom', slot = false, succeed = function () { }, message, type = 'default', height = 'auto', width = 'auto', html = '' }) {
        let than = this;
        let parentnode = document.body;
        let container = document.createElement("div");
        container.setAttribute('class', `Drawer`);
        this.Drawerkey.zIndex += 1
        container.style.zIndex = this.Drawerkey.zIndex;
        let content = document.createElement("div");
        content.innerHTML = html;
        container.appendChild(content);
        if (slot) {
            parentnode = this.searchassignattr('Drawer', slot);
            parentnode.style.position = 'absolute';
            container.style.position = 'absolute';
        }
        parentnode.appendChild(container);
        content.setAttribute('class', `Drawer_container Drawer_container_${placement}`);
        if (placement == 'bottom' || placement == 'top') {
            content.style.height = height;
            content.style[placement] = `-${content.style.height}`;
            setTimeout(res => {
                content.style[placement] = `0px`;
            }, 0)
        } else if (placement == 'right' || placement == 'left') {
            content.style.width = width;
            content.style[placement] = `-${content.style.width}`;
            setTimeout(res => {
                content.style[placement] = `0px`;
            }, 0)
        }
        content.onclick = function (e) {
            than.bubbling(e); //阻止事件冒泡
        }
        container.onclick = function () {
            parentnode.removeChild(container); //点击关闭销毁dom
        }
        succeed('成') //成功之后的回调
    }
    message({ tiem = 1000, succeed = function () { }, message, type = 'default' }) {
        let div = document.createElement("div");
        //设置默认值
        div.setAttribute('class', `${this.getclass('message')} ${type}`);
        div.style.top = this.messagekey.topnum - this.messagekey.topheight + 'px'; //每次递增
        div.style.opacity = 0;
        div.innerHTML = message;
        //节点存储
        this.messagekey.message_elmdata.push({
            node: div,
            index: 0,
            top: this.messagekey.topnum
        })
        document.body.appendChild(div);
        //获取上一个的高度 用于上一个消息之后填补缺位
        this.messagekey.topheight = div.offsetHeight + 20;
        //这里的宏任务用于异步处理原因是页面回流同步执行不设置宏任务的话就没办法执行过度动画了
        // let boxstyles = getComputedStyle(div);
        setTimeout(ekey => {
            div.style.top = this.messagekey.topnum + 'px'; //设置距离顶部的高度
            div.style.opacity = 1;
            this.messagekey.top.push(this.messagekey.topnum += this.messagekey.topheight);
            setTimeout(res => {
                succeed('结束');
                this.messagekey.message_elmdata.map(item => {
                    item.node.style.top = item.node.style.top.split('p')[0] - this.messagekey.topheight + 'px';
                })
                let pop_node = document.getElementsByClassName('message');
                document.body.removeChild(pop_node[0]);
                this.messagekey.message_elmdata.splice(0, 1);
                this.messagekey.topnum -= this.messagekey.topheight;
                if (this.messagekey.message_elmdata.length <= 0) {
                    this.messagekey.topnum = 20;
                    this.messagekey.topheight = 50;
                }
            }, tiem)
        }, 0)
    }
    //无障碍
    accessible() {
        let accessibledata = this.searchassignattr('accessible');
        accessibledata.map(item => {
            let synth = window.speechSynthesis; //创建语音
            let msg = new SpeechSynthesisUtterance(); //语音合成使用
            item.addEventListener('mouseover', function () {
                msg.text = item.getAttribute('accessible');
                msg.lang = 'zh-CN'
                synth.speak(msg);
                item.style.border = '2px solid red';
                item.style.cursor = 'pointer';
            })
            item.addEventListener('mouseleave', function () {
                synth.cancel(msg)
                item.style.border = '';
            })
        })

        // console.log(this.searchassignattr('accessible'), '无障碍')

    }
} 