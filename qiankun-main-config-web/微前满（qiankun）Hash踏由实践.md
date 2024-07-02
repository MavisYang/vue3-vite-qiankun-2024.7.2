# 微前端（qiankun）Hash 路由实践

qiankun 官方 demo 用的是 history 方式的路由，我们知道 history 需要后端配合，否则线上环境刷新会 404。接下来说明如何将主应用改为 hash 模式。

# 关于路由

## 1.存在问题

在采用 hash 路由模式的话，主应用路由会有/#/的前缀，比如主应用的 resource 组件路由:

```
http://localhost:8889/#/resource

```

假设 history 路由模式下子应用的注册信息为:

```
{
    name: 'live',
    entry:'//localhost:7102',
    container. '#subapp-viewport',
    activeRule:'/live',
}
```

此时 qiankun 只有命中 url 为 http://localhost:8889/live 才会加载子应用。

此处假设使用的路由切换代码为:

```
this.$router.push({
    path:'/live'
})
```

所以现在切换的 url 是 http://localhost:8889/#/live，显然不能匹配/live，所以加载子应用失败。我们需要修改一下子应用注册的 activeRule，便得匹配 hash 路由模式。

## 2.解决方案

为了区分开主应用的自身模块与子应用的路由区别，子应用的路由增加/micro 前缀，比如/micro/live 是子应用的路由。

那么 hash 路由模式下子应用的注册信息变成:

```
{
    name:'live',
    entry:'//localhost:7102',
    container. '#subapp-viewport',
    activeRule: '/#/micro/live',
}

```

路由切换代码修改为:

```
this.$router.push({
    path:'/micro/live'612
})
```

这样的话，主应用路由切换后的 url 就能命中子应用的 activeRule 了。

同时，子应用也需要将路由模式设置为 hash 模式，否则，会出现在子应用切换自身路由时，改变主应用 hash 路由的情况。

比如子应用切换自身路由/about，此时 url 会变成 http://localhost:8889/about/#/micro/live，导致路由命中失败。我们期望的 urlhttp://localhost:8889/#/micro/live/about。

所以，为了兼容主应用的 hash 模式路由，子应用也需要设置为 hash 模式的路由，最终结果是实现子应用路由与子应用注册在主应用的 activeRule 的一致性。

下面会分别对主应用与子应用进行配置。

# 配置子应用

子应用是常规 vue 项目，需要做调整的的是路由配置文件/router.index.js 以及入口文件 main.js。

## 1.路由增加前缀

```
// router/index.js

//判断是qiankun环境则增加路由前缀
if(window._POWERED_BY_QIANKUN__){
    prefix = '/micro/live'

}

const routes=[

    {
        path: prefix +/,
        name: 'home',
        component: Home,
    },
    {
        path: prefix +'about',
        name: 'about',
        component: About
    }
]
```

## 2.在路由跳转前添加前缀，保证和 router 中配置的 path 匹配上

```
// main.js

let router = null;
let instance = null;

function render(props = {}){
    const { container } = props;
    router= new VueRouter({                                              I
    //1.默认为hash路由模式
    //base: window._POWEREDBYQIANKUN_? '/micro/live' : /.
    //mode: 'history',
    routes,
})

//2.判断qiankun 环境则进行路由拦截，判断跳转路由是否有/micro/live开头前缀，没有则加上if(window._POWERED  BYQIANKUN_){
router.beforeEach((to, from, next)=>{
    if(!to.path.includes('/micro')){
        next({
            path: '/micro/live' + to.path
        })
    }else{
        next()
    })
}

instance= new Vue({
    router,
    stores,
    render: h => h(App)
}).$mount(container ? container.querySelector('#app') : '#app');

```

# 配置主应用

## 1.修改注册微应用时的路由匹配规则

因为主应用采用的是 hash 路由模式，qiankun 需要命中路由的话，activeRule 需要带上/#/前缀。

```
// App.vue

const apps= [
    {
        name: 'live',
        entry: '//localhost:7101',
        container:'#subapp-viewport',
        activeRule:'/#/micro/live',
    },
    //...
]

registerMicroApps(apps)

```

## 2.增加路由

使得主应用对于/micrApp/dev 和/micrApp/dev/about 匹配到的是同一个路由组件。

```
// router/index.js
// ...
{
    name: 'live',
    entry:'//localhost:7101',
    container: '#subapp-viewport',
    activeRule:'/#/micro/live',
},
{
    path:/micrApp/live/:micrAppRoute，//匹配微应用内的路由跳转，vue-router v3.x需要使用/micrApp/live/＊方式匹配
    hidden:true,
    component: 0=> import('@/views/prod/index'),
    name: 'live'
}
//...
```

现在，当 url 变化时，首先会进入 qiankun 的匹配规则中，匹配到/#/micro/live 时，会加载微应用到节点，同时。主应用的 vue-router 匹配到/micrApp/live 路由后会跳转到对应的路由组件；然后微应用的 vue-router 匹配后会展示相应的微应用路由。

当微应用内部的＜ router-link to ＝＂/about＂＞被点击时，首先微应用跳转路由前会加上/micro/live 前缀，所以就是往/micro/live/about 跳转，匹配到 about 路由；然后在主应用的 vue-router 中匹配到/micro/live/:microRoute 路由，保持主应用路由为同一个路由组件。
