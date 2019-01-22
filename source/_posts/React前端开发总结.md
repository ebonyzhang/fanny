---
title: React前端开发总结
tag: React
category: React
date: 2019-01-21
---

>第一次使用react，还是习惯性的去找了合适的移动开发框架，直接在此基础上迭代开发。
>优点是能快速及时上手一个项目，边开发应用边学习，能做出一个可以用，可以看的东西。
>缺点是不能系统的学习，她的特性不能系统全面地掌握以及与之相关的技术底层能用但是原理模糊。
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
1. 在 Chrome 上可以安装 React 开发者工具插件，这样就能在浏览器的开发控制台里看到 React 渲染出来的组件树，调试查看挺方便。
2. 微信web开发者工具。鉴于开发微信公众号应用，开发使用微信web开发者工具，可以提供公众号网页和小程序的开发，微信API里有提供下载链接。
https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1455784140
## React全家桶
>react + redux + react-router + less/sass + ES6 + webpack 
react全家桶，react使用的标配，一个个做简单的说明。

### 构建开发环境demo
使用create-react-app构建React开发环境，node以及npm已配置。
npm慢可以使用淘宝定制的cnpm，设置如下：

    npm install -g cnpm --registry=https://registry.npm.taobao.org
    npm config set registry https://registry.npm.taobao.org
   
**create-react-app demo安装**

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
虽然使用的脚手架中整合了redux，但是在使用中，为了赶进度没有使用，重构的时候也把这部分也加上了。

>只有遇到 React 实在解决不了的问题，你才需要 Redux 。

redux简单做了个总结。
[Redux总结](https://ebonyzhang.fun/2019/01/21/redux/)

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
>React Router 提供一个 routerWillLeave生命周期钩子，这使得 React 组件可以拦截正在发生的跳转，或在离开 route 前提示用户。routerWillLeave 返回值有以下两种：
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
 <div  className="slider__slide" //此处
    data-active={active}
    style={slideStyle}
    onTouchStart={(ev) => { this.clickCarousel(carouselId, ev); }}
    onTouchEnd={(ev) => { this.touchEnd(ev); }
    }></div> //此处
</a>

<a href={link}>
 <div 
    className="slider__slide" //换行
    data-active={active}
    style={slideStyle}
    onTouchStart={(ev) => { this.clickCarousel(carouselId, ev); }}
    onTouchEnd={(ev) => { this.touchEnd(ev); }
    }/> //空的div去除
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
## react UI库
UI库的选择上，找了好几个，鉴于微信公众号网页的兼容性，最后选择了react-weui。

### Material-UI
>Material-UI是一个实现了Google's Material Design设计规范的react组件库。

### Ant-design
>蚂蚁金服开发的一个基于react的UI组件库

### react-weui

**API**
https://weui.github.io/react-weui/docs

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

## 支付宝支付
其实一开始对微信里使用支付宝支付这个感觉有点喧宾夺主了。但是微信里还真的可以这么干，也挺有意思的。总之，用户需求至上。
不过支付宝给出的解决方案里真正使用有点另起炉灶的意思。

**1.需要引入相关的js文件作为支撑ap.js。**

```
(function(){var b={};var a={};a.PADCHAR="=";a.ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";a.makeDOMException=function(){var f,d;try{return new DOMException(DOMException.INVALID_CHARACTER_ERR)}catch(d){var c=new Error("DOM Exception 5");c.code=c.number=5;c.name=c.description="INVALID_CHARACTER_ERR";c.toString=function(){return"Error: "+c.name+": "+c.message};return c}};a.getbyte64=function(e,d){var c=a.ALPHA.indexOf(e.charAt(d));if(c===-1){throw a.makeDOMException()}return c};a.decode=function(f){f=""+f;var j=a.getbyte64;var h,e,g;var d=f.length;if(d===0){return f}if(d%4!==0){throw a.makeDOMException()}h=0;if(f.charAt(d-1)===a.PADCHAR){h=1;if(f.charAt(d-2)===a.PADCHAR){h=2}d-=4}var c=[];for(e=0;e<d;e+=4){g=(j(f,e)<<18)|(j(f,e+1)<<12)|(j(f,e+2)<<6)|j(f,e+3);c.push(String.fromCharCode(g>>16,(g>>8)&255,g&255))}switch(h){case 1:g=(j(f,e)<<18)|(j(f,e+1)<<12)|(j(f,e+2)<<6);c.push(String.fromCharCode(g>>16,(g>>8)&255));break;case 2:g=(j(f,e)<<18)|(j(f,e+1)<<12);c.push(String.fromCharCode(g>>16));break}return c.join("")};a.getbyte=function(e,d){var c=e.charCodeAt(d);if(c>255){throw a.makeDOMException()}return c};a.encode=function(f){if(arguments.length!==1){throw new SyntaxError("Not enough arguments")}var g=a.PADCHAR;var h=a.ALPHA;var k=a.getbyte;var e,j;var c=[];f=""+f;var d=f.length-f.length%3;if(f.length===0){return f}for(e=0;e<d;e+=3){j=(k(f,e)<<16)|(k(f,e+1)<<8)|k(f,e+2);c.push(h.charAt(j>>18));c.push(h.charAt((j>>12)&63));c.push(h.charAt((j>>6)&63));c.push(h.charAt(j&63))}switch(f.length-d){case 1:j=k(f,e)<<16;c.push(h.charAt(j>>18)+h.charAt((j>>12)&63)+g+g);break;case 2:j=(k(f,e)<<16)|(k(f,e+1)<<8);c.push(h.charAt(j>>18)+h.charAt((j>>12)&63)+h.charAt((j>>6)&63)+g);break}return c.join("")};b.pay=function(d){var c=encodeURIComponent(a.encode(d));location.href="pay.htm?goto="+c};b.decode=function(c){return a.decode(decodeURIComponent(c))};window._AP=b})();
```
**2.支付宝生成签名**

请求生成支付宝签名返回参数作为支付宝支付的参数。
```
let params = new FormData();
params.append('loginId', user.id);  
params.append('orderNo', orderNo);  
ApiClientUtil.post(ApiInfo.Alipay, params).then((json) => {  
  if(json.success) {
    const gotoUrl='https://openapi.alipay.com/gateway.do?'+ json.body;
    window._AP.pay(gotoUrl);
  }else {
    Alert.error('支付宝支付遇到问题，请重新尝试', {position: 'top',
      offset: 40,onRouteClose: true, timeout: 2000});
    return;
  }
})
```
**3.跳转到pay.htm**
这个页面当用户选择支付宝账户点击确认支付时，页面跳转到此页面提示用户打开浏览器，进而完成支付的页面，在新的浏览器网页中完成支付宝支付。
***请在菜单中选择在浏览器中打开,以完成支付...***
```
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8"
    ">
    <title>支付提示</title>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <meta name="format-detection" content="telephone=no"/>
    <meta name="format-detection" content="email=no"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0"/>
    <style>
        *, :before, :after {
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
        }

        body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, form, fieldset, legend, input, textarea, p, blockquote, th, td {
            margin: 0;
            padding: 0
        }

        table {
            border-collapse: collapse;
            border-spacing: 0
        }

        fieldset, img {
            border: 0
        }

        li {
            list-style: none
        }

        caption, th {
            text-align: left
        }

        q:before, q:after {
            content: ""
        }

        input:password {
            ime-mode: disabled
        }

        :focus {
            outline: 0
        }

        html, body {
            -webkit-touch-callout: none;
            touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            tap-highlight-color: transparent;
            height: 100%;
            margin: 0;
            padding: 0;
            text-align: center;
            font-size: 15px;
            font-weight: 300;
            font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif
        }

        a {
            text-decoration: none
        }

        body {
            background: #F4F4F8
        }

        .weixin-tip {
            display: none;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            position: absolute;
            top: 15px;
            right: 20px;
            width: 265px;
            padding: 55px 0 0;
            text-align: left;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAACICAMAAABQgAwUAAAAMFBMVEUAAADY2NjY2NjY2NjY2NjY2NjY2NjY2NjX19fY2NjY2NjY2NjY2NjY2NjY2NjY2Njr/TvvAAAAD3RSTlMAxy89c9CdTRyG7lvcD7FzqbJAAAACFklEQVR42uWYy4rkMBAErZdlPdzx/3+7LAw0tH0Y2orDsnnyKQlSVaWytoc6xrEpigFoinUAIBnWABAE5woW9o6GPbGwI1jYGSzsgoV9goU9wMLe0bA7FnYCC7uBhV2wsE+wsAdY2AENGyzsBBZ2Q8MuWNgH94pLbgELO6Bhg4VdwcJuaNgTCzuChZ3Bwg5o2GBhV7CwdzTsjoUdwcLOYGEXLOwTLOwBFvaOht2xsBNY2I1f6lhaenvhrfpkAblab+k9b/OD0iuX2F9/x8D+7ZL2pmpbuj+6o3Vg//oWmPU9p65VkXL6+oIJ8S738nwj62Pb1lvHACH+fBs7sG59U3yrVD3rce3GVcp8qGkPAGTprQUYy6xfaE8i82b6S7/pfZnzdYQIHeOXdfYKpHoFcmrvWlM8RW+CDO8JMWoNM/+FeyB4UfMpL48g5qG1Iqc29YI3mqq2knXvEJu2onJoQy9ok4mkQZf/GjqitUvQyqN6SU8NOvOhHq25xNCWj6LFQdLiyKuaZWpxBC2OrFVHxdryElbQsVtBx6KN0qAd4a71yo610uxa2b0s5xg052I5p26d4MCqusZFwzrAnqQhSogSMnkNcr+GUS3kEKWS62NJFlNCToWLZpWMe14RReGqdjz2PfNECbkGbrQ/Nj5q5y7j8/HRTW5UhvHfA7Mdzitji8rfWsgX3gVZ91eO22odKed6LLf9A/sRnc74RV7lAAAAAElFTkSuQmCC) no-repeat right top;
            background-size: 45px 68px
        }

        .weixin-tip-img {
            display: none;
            padding: 110px 0 0
        }

        .weixin-tip-img::after {
            display: block;
            margin: 15px auto;
            content: ' ';
            background-size: cover
        }

        .weixin-tip-img.iphone::after {
            width: 150px;
            height: 150px;
            background-image: url(data:image/png;base64,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)
        }

        .weixin-tip-img.android::after {
            width: 173px;
            height: 240px;
            background-image: url(data:image/png;base64,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)
        }
    </style>
</head>
<body>
<div class="J-weixin-tip weixin-tip">
    <div class="weixin-tip-content">
        请在菜单中选择在浏览器中打开,<br/>
        以完成支付
    </div>
</div>
<div class="J-weixin-tip-img weixin-tip-img"></div>

<div>
    <br/>
    <a href="/" name="" style="font-size: 16px;color: green;">支付完成，点此返回主页</a>  
</div>
        

<script type="text/javascript" src="ap.js"></script>
<script>
    if (location.hash.indexOf('error') != -1) {
        alert('参数错误，请检查');
    } else {
        var ua = navigator.userAgent.toLowerCase();
        var tip = document.querySelector(".weixin-tip");
        var tipImg = document.querySelector(".J-weixin-tip-img");
        if (ua.indexOf('micromessenger') != -1) {
            tip.style.display = 'block';
            tipImg.style.display = 'block';
            if (ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1 || ua.indexOf('ipod') != -1) {
                tipImg.className = 'J-weixin-tip-img weixin-tip-img iphone'
            } else {
                tipImg.className = 'J-weixin-tip-img weixin-tip-img android'
            }
        } else {
            var getQueryString = function (url, name) {
                var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
                if (reg.test(url)) return RegExp.$2.replace(/\+/g, " ");
            };
            var param = getQueryString(location.href, 'goto') || '';
            location.href = param != '' ? _AP.decode(param) : 'pay.htm#error';
        }
    }
</script>
</body>
</html>
```

## 微信支付
参考这个实现
https://blog.csdn.net/wyk304443164/article/details/72845409

首先，用户选择微信支付，传入订单号。
```
 let _that = this;
 Pay.done(order.bookNum, _that, 1, is_true => {
   if (is_true) {
     Alert.success('支付成功', {
       position: 'top',
       offset: 40,
       onRouteClose: true, 
       timeout: 1500,
       onClose: function () {
         Utility.toPage('order');
       }
     });
   } else {
     Alert.error('微信支付失败,请重新尝试', {position: 'top',
       offset: 40,onRouteClose: true, timeout: 2000});
     return;
   }
 });
```

**Pay组件支付实现**
支付过程中先由微信生成预支付信息，用户支付完成后执行成功提示等操作。同时，后台接口提供订单回调，修改订单状态业务等。
```
import 'react-jweixin';
 
let Pay = {};

/**
 * 支付的回调
 */
let payCallback;

/**
 * 开始支付--这个方法其实是从后台请求微信支付签名。成功继续，失败回调
 * @param _order_id 传bookNum即可
 * @param openid 微信公众号openid
 * @param _thisObj 传this即可
 * @param _payType 支付类型--暂时只有微信
 * @param _callback 回调 true or false
 */
Pay.done = function (_order_id, _thisObj, _payType, _callback) {
    let params = new FormData(); 
    params.append('searchParam.bookNum', _order_id); 
    params.append('searchParam.useFlag', 0); //0新商户
    let openid = sessionStorage.getItem('openid'); 
    params.append('searchParam.openid', openid);  
    if (typeof _callback === "function") {
        payCallback = _callback;
    }

    ApiClientUtil.post(ApiInfo.PaySign, params).then((data) => {
        if(data.head.success) {
            this.doneResponse(data.body);
        }
    }).catch(() => {
        payCallback(false);
    });
};

Pay.doneResponse = function (result) {
    this.callPay(result);
};

Pay.callPay = function (code) {
    if (typeof WeixinJSBridge === "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
        }
    } else {
        this.jsApiCall(code);
    }
};

Pay.jsApiCall = function (code) {
    WeixinJSBridge.invoke('getBrandWCPayRequest', code, function (res) {
        if (!Utility.isNull(res) && !Utility.isNull(res.err_msg) && res.err_msg.indexOf('ok') > 0) {
            payCallback(true);
        } else {
            payCallback(false);
        }
    });
};

export { Pay as default }
```



## 百度地图
**React-Bmap API**
https://huiyan-fe.github.io/react-bmap/examples/
>React-BMap只是利用了React组件的生命周期，来调用对应的百度地图JavaScript Api的方法，比如在componentDidMount和componentDidUpdate的时候在地图上添加覆盖物，componentWillUnmount的时候移除覆盖物，React对应的render渲染函数模块返回的是null。所以这里面地图相关的dom并不是react渲染的，真正创建地图之类的还是使用百度地图JavaScript Api，React-BMap只是利用了React组件的写法来封装百度地图JavaScript Api，使我们在使用React的时候能更方便的使用百度地图JavaScript Api。
### 基本设置
**申请百度地图账号**
首先去百度地图开放平台官网注册成为开发者.

http://lbsyun.baidu.com/

创建应用，获取移动账户秘钥。

### 安装

    npm install react-bmap

### 使用
**首页引入api**

    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=你的秘钥"></script>

**引入组件**

    import { Map, Marker, Polyline, PointLabel, NavigationControl, MarkerList } from 'react-bmap';

**具体实现实例**
基本地图标记

    <Map center={center} zoom="13">
     {
        mapdata.map((item, index) => {
          if (isFlag==0) {//
            return (
              <Marker key={index}  position={{lng: item.longitude,lat: item.latitude}} >
                <img style={{height:'3rem',width:'3rem'}} src={require('./images/air.png')} />
                <div style={{fontSize:'0.8rem',color:'red',fontWeight: 'bold', width:'30rem'}}>{item.num} </div>  
              </Marker>
            )  
          }
        }) 
      } 
      <NavigationControl />
    </Map> 
    
**二、其他实例**

```
<Map center={center} zoom="17" style={{height: '44rem'}}>         
 {/*<PointLabel data={points} />*/} 
  {/*<MarkerList data={ points }  /> */} // 绘制标记点
  
  {
    markers.map((marker, index) => {
       return (
          <Marker position={{lng: marker.lng, lat: marker.lat}} offset={new window.BMap.Size(-15, -20)}>
            <img src={require('./images/start_pos.png')} onClick={(event) => this.handleClick(marker, event)}/>  
            <div id={'marker'+marker.porder} style={{fontSize:'0.8rem',color:'red', display:'none'}}>{marker.name} </div>            
          </Marker>  
        )
    })
  }
  <Polyline strokeColor='blue' path={ markers} /> //绘制线路
  <NavigationControl anchor="BMAP_ANCHOR_TOP_RIGHT"/> 
</Map> 
         
```

## 二维码组件
**API**
https://www.npmjs.com/package/qrcode-react
### 安装

    npm install qrcode-react

### 使用
**引入组件**

    import QRCode from 'qrcode-react';
**具体使用**

    <Dialog type="ios" show={this.state.showQR} buttons={this.state.passStyle.buttons} >
      <QRCode size={236} value={ qrstr } />
    </Dialog>

可以设置logo，背景色，大小等。
![qrcode可设置属性](https://img-blog.csdnimg.cn/20190122102047726.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hpbmdmdXpoaWppYW54aWE=,size_16,color_FFFFFF,t_70)

## react-s-alert组件
### 安装

    npm install react-s-alert --save

### 使用
**在APP中引入样式与库文件**

    import Alert from 'react-s-alert';
    require('react-s-alert/dist/s-alert-default.css');
    require('react-s-alert/dist/s-alert-css-effects/genie.css');

**具体使用**

    import Alert from 'react-s-alert';

**警告提示**
```
Alert.warning('请选择', {position: 'top',
            offset: 40,onRouteClose: false, timeout: 1500});
```
**错误提示**

    Alert.error(json.head.msg, 
    	{position: 'top', offset: 40,onRouteClose: false, timeout: 2000,
        onClose: function () {
           Utility.toPage('order');
        }
    });
   
  onClose事件处理提示完之后的操作。
 
## react-confirm-alert

### 安装
```
npm install react-confirm-alert --save
```
### 使用
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
## 其他

做完这一个项目，对react以及相关组件了解了个大概，但现在看代码还是很杂很乱，看着闹心。
为了赶进度，一些react特性没有好好地应用，还是原始的JavaScript方式。
这次基本总结的同时也开始进行了项目重构，希望可以发挥react的优势，优化代码，优化调用以及实现方式等，争取年前完成。

>文献资料
从零搭建React全家桶框架教程
https://github.com/brickspert/react-family
https://react.docschina.org/docs/thinking-in-react.html

