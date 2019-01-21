---
title: React前端开发总结
tag: React
category: React
date: 2019-01-21
---

>第一次使用react，还是习惯性的去找了合适的移动开发框架，直接在此基础上迭代开发。
>优点是能快速及时上手一个项目，边开发应用边学习，能做出一个可以用，可以看的东西。
>缺点是不能系统的学习，她的特性不能系统全面地掌握以及与之相关的技术底层能用但是原理不知其所以然。
>整个项目虽然功能实现，但是是在一知半解状态做出来，边开发边解决问题，边重构迭代，react的优势并没有完全发挥出来。
>希望系统学习之后能进行一次整体重构。

## 开发工具选择
### 开发工具
#### Sublime Text 3 
    使用这个就是因为以前用过，上手快，而且她快速，稳定，但是需要购买证书。
#### Vscode
     速度较快，对超大文件读写速度飞快。
####  Atom
    速度一般，更新快，占用资源较大。

### 调试工具
在 Chrome 上可以安装 React 开发者工具插件，这样就能在浏览器的开发控制台里看到 React 渲染出来的组件树，调试查看挺方便。

## React全家桶
>react + redux + react-router + less/sass + ES6 + webpack 
react全家桶，react使用的标配，一个个做简单的说明。

### 构建开发环境demo
使用create-react-app构建React开发环境，node以及npm已配置。
npm慢可以使用淘宝定制的cnpm，设置如下：

    npm install -g cnpm --registry=https://registry.npm.taobao.org
    npm config set registry https://registry.npm.taobao.org
   
create-react-app demo安装

    create-react-app my-app
    cnpm install -g create-react-app
    cd my-app/
    npm start
    
启动之后，http://localhost:3000/ 
接下来可以在此基础上，学习或者实验react相关...

### react
    采用声明式，高效而且灵活的用来构建用户界面的框架。
    官方文档 https://react.docschina.org 

#### 虚拟dom
	react-dom提供操作DOM的扩展库。 
#### JSX
	通过babel解析JSX语法代码转为纯JS语法代码的库。
#### 组件
   面向组件编程的(组件化编码开发)，最后得到标签代码，同时组件之间可以进行通信，数据传递也非常灵活。
关于组件通信方式，下面单独做了实验与总结。

 **组件通讯方式**
 
  [组件通信方式汇总](https://blog.csdn.net/xingfuzhijianxia/article/details/86151243)
  
**其他**
组件上加上prop-types进行验证

> optionalArray: PropTypes.array, 
> optionalBool: PropTypes.bool,
> optionalFunc: PropTypes.func, 
> optionalNumber: PropTypes.number,
> optionalObject: PropTypes.object, 
> optionalString: PropTypes.string,
> optionalSymbol: PropTypes.symbol

### redux 
虽然使用的框架中整合了redux，但是在使用中，为了赶进度仍然没有用，重构的时候也把这部分也加上了。

>只有遇到 React 实在解决不了的问题，你才需要 Redux 。

redux简单实例。
[Redux](https://blog.csdn.net/xingfuzhijianxia/article/details/86523480)

### react-router
>用于构建路由，主要有Router，IndexRoute，Route，Link，IndexLink这几个组件，以及hashHistory，browserHistory。

#### 安装
    npm install --save react-router

#### 使用
项目部署的时候，原配置createHashHistory出现一片白问题，后来更换了createBrowserHistory，重新部署后可访问。
区别
browserHistory 其实使用的是 HTML5 的 History API，浏览器提供相应的接口来修改浏览器的历史记录；
hashHistory 是通过改变地址后面的 hash来改变浏览器的历史记录。

```
import createHistory from 'history/createBrowserHistory'
```
从 React Router 中导入 <Router /> <Route />

    import { BrowserRouter as Router, Route } from 'react-router-dom';	

**react-router嵌套路由**
> Router包裹Route，
> 当url变化的时候，Router将会匹配到指定的路由，然后渲染路由绑定的组件。
> Route用来显式地把路由映射到应用的组件结构上。 用path指定url，用component指定路由命中url后需要渲染的那个组件。
   
如下：

    <Router basename={AppCfg.app.BaseName}>
     <App>
       <Route exact path="/" component={CreateComponent(Default)} />         
        <Route path="/home" component={CreateComponent(Home)} />
        <Route path="/userinfo" component={CreateComponent(UserInfo)} />
      </App>
    </Router>

>通过Provider将redux绑定到react，同时用Provider包裹路由，路由控制器就可以访问store。

    <AppContainer warnings={false}>
      <Provider store={ApiClientStore} key="provider">
        <Router history={history}>
          {RootElement}
        </Router>
      </Provider>
    </AppContainer>

**Switch** 
>Switch的特点是从上往下读,只要有一个匹配成功,就不会往下读(Switch是由包容性变成排他性的一个重要组件)    

在具体页面跳转中使用switch

```
import { Switch } from 'react-router-dom';

const { location } = route || {};
const { key } = location || {};
<Switch key={key} location={location}>
  {this.props.children}
</Switch>
```
其他
>React Router 提供一个 routerWillLeave 生命周期钩子，这使得 React 组件可以拦截正在发生的跳转，或在离开 route 前提示用户。routerWillLeave 返回值有以下两种：
return false 取消此次跳转
return 返回提示信息，在离开 route 前提示用户进行确认。

```
import { Lifecycle } from 'react-router'

const Home = React.createClass({

  // 假设 Home 是一个 route 组件，它可能会使用
  // Lifecycle mixin 去获得一个 routerWillLeave 方法。
  mixins: [ Lifecycle ],

  routerWillLeave(nextLocation) {
    if (!this.state.isSaved)
      return 'Your work is not saved! Are you sure you want to leave?'
  },

  // ...

})
```


**Links** 
Link在内部做了一个操作,把标签变成了a标签。

    <Link to="user" params={{userId: user.id}}>touser</Link>

**Redirect组件(重定向)**
from(使用绝对路径)  
exact(精准匹配)  
to(跳转路径)

### less/sass
本次开发中使用sass，由于使用了react-weui样式使用较少了。
SASS是一种CSS的开发工具，使CSS的开发，变得简单和可维护。
可以查看阮一峰老师关于此教程。
http://www.ruanyifeng.com/blog/2012/06/sass.html

### ES6 
**声明方式**
var 、function 、let 、const 、import、 class。
>ES6中明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域，凡是在声明之前就使用这些变量就会报错。

**箭头函数**
相当于匿名函数，使用“箭头”（=>）定义函数。
**无参箭头函数**
    setInterval(() => this.nextSlide(), 2000);
**一个参数箭头函数**

    x => {console.log(x*x)}

**多个参数箭头函数**
   参数需要用括号()括起来

     'use strict'
      var arr = [10, 20, 1, 2];
      arr.sort((x, y) => {
        if(x-y>0){
            return 1;
        }else{
            return -1;
        }
     });
     console.log(arr); // [1, 2, 10, 20]
**可变参数**
...rest
```
(x, y, ...rest) => {
	var i, sum = x + y;
	 for (i=0; i<rest.length; i++) {
	     sum += rest[i];
	 }
	 return sum;
}
```
**其他**
1. this,箭头函数内部的this是词法作用域，由上下文确定。
2. 函数体返回表达式的需要使用括号，例 x => ({ foo: x })

>Es6箭头函数说明挺全也很简明
https://www.cnblogs.com/snandy/p/4403111.html

### ESLint 
>ES6 ESLint 是一个语法规则和代码风格的检查工具，可以用来保证写出语法正确、风格统一的代码。

重构时候原来的代码都有问题，前后空格、无效的代码以及分号等等各种问题。
一开始使用eslint确实会影响进度，但是对于规范代码以及语法有很好的引导，虽然麻烦点，最后的使用效果不错。
类似如下错误，根据提示修改即可。
(1) expected parenteses around arrow function argument having a body with curly braces arrow-parens
箭头函数参数周围的预期括号具有带大括号的主体
(2) Empty components are self-closing
组件内部空时，不需要自己关闭，如下：
```

<a href={link}>
 <div  className="slider__slide"
    data-active={active}
    style={slideStyle}
    onTouchStart={(ev) => { this.clickCarousel(carouselId, ev); }}
    onTouchEnd={(ev) => { this.touchEnd(ev); }
    }></div> //此处
</a>

<a href={link}>
 <div 
    className="slider__slide"
    data-active={active}
    style={slideStyle}
    onTouchStart={(ev) => { this.clickCarousel(carouselId, ev); }}
    onTouchEnd={(ev) => { this.touchEnd(ev); }
    }/>
</a>
```

### webpack 
>WebPack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用

webpack与Gulp的区别

>Grunt和Gulp的工作方式是：在一个配置文件中，指明对某些文件进行类似编译，组合，压缩等任务的具体步骤，工具之后可以自动替你完成这些任务。
>Webpack的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包为一个（或多个）浏览器可识别的JavaScript文件。
>Webpack的处理速度更快更直接，能打包更多不同类型的文件

这个不详细写了，要再实践总结下，但是这篇文章写得很好，值得学习。
https://segmentfault.com/a/1190000006178770?utm_source=tag-newest
### react UI库
#### Material-UI
>Material-UI是一个实现了Google's Material Design设计规范的react组件库。
#### Ant-design
>蚂蚁金服开发的一个基于react的UI组件库
#### react-weui

选择这个ui库本着做微信公众号开发，考虑到她能更好的兼容微信浏览器。

**1.安装**

    npm install weui@1.1.0 react-weui --save

**2.使用**
在App.js中引入模块。

    import 'weui';
    import 'react-weui/build/packages/react-weui.css';

实际使用中，import 相应的组件即可，以首页的tab切换页为例，如下：

```
import { Tab, TabBody, TabBar, TabBarItem, Article } from 'react-weui';
```
详细页面如下

```
<Tab>
 <TabBody>
    <Article style={{ display: this.state.tab == 0 ? null : 'none' }}>
      <h1>Page 1</h1>
      <section>
        <h2 className="title">Heading</h2>
        <section>
          <h3>1.1 Title</h3>
          <p>1111</p>
        </section>
      </section>
    </Article>
    <Article style={{ display: this.state.tab == 1 ? null : 'none' }}>
      <h1>Page 2</h1>
      <section>
        <h2 className="title">Heading</h2>
        <section>
          <h3>2.1 Title</h3>
          <p>222</p>
        </section>
      </section>
    </Article>
  </TabBody>
  <TabBar>
    <TabBarItem
      active={this.state.tab == 0}
      icon={<img src={this.state.urlmain} alt="购票主页" />}
      onClick={(e) => this.handleTab(e, 0)}
      label="主页"
    />
    <TabBarItem
      active={this.state.tab == 1}
      icon={<img src={this.state.urlmine} alt="个人中心" />}
      onClick={(e) => this.handleTab(e, 1)}
      label="个人中心"
    />
  </TabBar>
</Tab>
```
效果如下图

![初始化展示](https://img-blog.csdnimg.cn/20190116135946181.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hpbmdmdXpoaWppYW54aWE=,size_16,color_FFFFFF,t_70)

react-weui提供了一系列的组件，可以方便引入和使用，基本可以满足项目中的应用。

### 集成react-s-alert
#### 安装

    npm install react-s-alert --save

#### 使用
在APP中引入样式与库文件。

    import Alert from 'react-s-alert';
    require('react-s-alert/dist/s-alert-default.css');
    require('react-s-alert/dist/s-alert-css-effects/genie.css');

具体使用

    import Alert from 'react-s-alert';

警告提示
```
Alert.warning('请选择添加购票人员', {position: 'top',
            offset: 40,onRouteClose: false, timeout: 1500});
```
错误提示

    Alert.error(json.head.msg, 
    	{position: 'top', offset: 40,onRouteClose: false, timeout: 2000,
        onClose: function () {
           Utility.toPage('order');
        }
    });
   
  onClose事件处理提示完之后的操作。
 
### react-confirm-alert
#### 安装

```
npm install react-confirm-alert --save
```
#### 使用
引入相关样式与组件
```
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
```
以退票提示为例，在退票操作之前，询问用户是否确认退票(或者常见的删除前确认提示)。
```
confirmAlert({
  title: '操作提示',
   message: '退票将产生['+fee+']元手续费，您确认执行退款操作吗?',
   buttons: [
     {
       label: '确认',
       onClick: () => this.refund() // 执行退票功能
     },
     {
       label: '取消',
       onClick: () => console.log('取消了操作...')
     }
   ]
})
```

关于提示的样式可以根据API来设置或者到源码里改改界面颜色。
**API**
https://www.npmjs.com/package/react-confirm-alert
## 问题

做完这一个项目，对react以及相关组件了解了个大概，但现在看代码还是很杂很乱，看着闹心。
为了赶进度，一些react特性没有好好地应用，还是原始的JavaScript方式。
这次基本总结的同时也开始进行了项目重构，希望可以发挥react的优势，优化代码，优化调用以及实现方式等，争取年前完成。


## 其他

>文献资料
从零搭建React全家桶框架教程
https://github.com/brickspert/react-family
https://react.docschina.org/docs/thinking-in-react.html

