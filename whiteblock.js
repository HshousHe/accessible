window.onload = function () {
    let container = document.querySelector('#whiteblock');
    let container_height = 50;
    let grade = 0;
    let randNumKey = 0;
    let Elm = new elm({ use: [] });
    let randNumKeydata = [];
    let gather = [];
    let tiemr = setInterval(res => {
        if (gather.length > 7) {
            Elm.message({
                tiem: 4000,
                message:'游戏结束'
            })
            clearTimeout(tiemr);
        } else {
            create().then(res => {
                gather.push([...res]);
            })
            // gather.push([...create()]);
        }
    }, 1000)
    function create() {
        return new Promise((resolve, reject) => {
            let list = [];
            let randNum = rand(0, 3);
            let toload = true;
            if (toload) {
                for (let i = 0; i < 4; i++) {
                    if (randNum == i) {
                        list.push({
                            state: true
                        })
                    } else {
                        list.push({
                            state: false
                        })
                    }
                }
                createDom(list)
                resolve(list);
            }
        })
    }
    function createDom(sondata) {
        let sumuplength = gather.length;
        let master = document.createElement("div");
        master.setAttribute('class', 'samallcontainer');
        sondata.map(item => {
            let sonnode = document.createElement("div");
            sonnode.setAttribute('state', item.state);
            if (item.state) {
                sonnode.setAttribute('class', 'smallblock small_bg');
            } else {
                sonnode.setAttribute('class', 'smallblock');
            }
            sonnode.onclick = function () {
                if (sonnode.getAttribute('state') == 'true' && sumuplength + 1 == gather.length) {
                    console.log('清除');
                    grade += 1;
                    document.querySelector('#grade').innerHTML = `${grade}分`
                    gather.splice(sumuplength, 1);
                    container.removeChild(master);
                } else {
                    Elm.message({
                        tiem: 4000,
                        message:'游戏结束,注意事项:只能第一列开始点'
                    })
                }
            }
            master.appendChild(sonnode)
        })
        // master.style.top = gather.length * container_height + 'px';
        container.appendChild(master);
    }
    //随机数
    function rand(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}