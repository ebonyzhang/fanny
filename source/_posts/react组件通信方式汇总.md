---
title: React组件通信方式总结
tag: React
category: React
date: 2019-01-09
---

## React组件通信方式

 ### 父组件向子组件通信
  父组件更新组件状态，通过props传递给子组件，子组件得到后进行更新。
 Timer 是倒计时子组件，集成在了OrderPay父组件里，父组件向子组件传订单数据参数order对象。如下代码：

    <Timer order={order} /> //倒计时组件

在子组件里直接通过props获取父组件传递过来的参数，如下：

    let order = this.props.order;//订单详情
    
### 子组件向父组件通信
  子组件更新组件状态，通过回调函数的方式传递给父组件。
  子组件调用父组件通过props传给它的函数更新父组件state，进而完成子组件向父组件的通讯。

**先看父组件**
```
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//导入子组件
import Child from './child.js'; 

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      msg: '父组件初始msg'
    }
  }

  //父组件回调函数，更新state，进而更新父组件。
  callback=(msg)=>{
    // setState方法,修改msg参数,值是由子组件传过来。
    this.setState({msg});
  }

  render() {
    return (
      <div className="App">
        <p>子组件传值实验: {this.state.msg}</p>
        <Child callback={this.callback} ></Child>
      </div>
    );
  }
}

export default App;
```
**再看子组件**

```
import React from "react";

class Child extends React.Component{
	constructor(props){
      	super(props);
	    this.state={
	    	msg: '子组件msg传值'
	    }
    }
    //通过props调用回调函数传值
    trans=()=>{
        this.props.callback(this.state.msg);
    }
    render(){
        return(
            <div>
                <button onClick={this.trans}>激发trans事件，传值给父组件</button>
            </div>
        )
    }
}

export default Child;
```
**效果**
![父组件初始展示](https://img-blog.csdnimg.cn/2019010910104894.png)

![子组件更新后展示](https://img-blog.csdnimg.cn/20190109101112169.png)
  
  ### 跨级组件间通信
  举个例子react-redux的<Provider />，也是通过Context提供一个全局态的store。还有用户信息的使用，也可以通过context中传递数据。

  通过props或state传值比较麻烦，context提供了一种组件之间共享数据的方式，可以避免数据在组件树上逐层传递，也就是用Context来实现跨层级的组件数据传递。

这篇文章写得非常好，看完就能理解context，上手实验更能理解透彻，毕竟最后都要应用起来。
https://www.jianshu.com/p/eba2b76b290b?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation
>Context API的使用基于生产者消费者模式。生产者一方，通过组件静态属性childContextTypes声明，然后通过实例方法getChildContext()创建Context对象。消费者一方，通过组件静态属性contextTypes申请要用到的Context属性，然后通过实例的context访问Context的属性。

**生产者**
```
import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import CppComponent from './Cpp.js';

class App extends Component {

  constructor(props){
    super(props);
  }

  //生产者
  //Context生产者，通过静态属性childContextTypes声明提供给子组件的Context对象的属性，
  static childContextTypes = {
    propA: PropTypes.string
  }
  
  //实例getChildContext方法，返回Context对象
  getChildContext () {
    return {
      propA: 'propA'
    }
  }

  render() {
    return <BppComponent />
  }
}

class BppComponent extends React.Component {
  render () {
    return <CppComponent />
  }
}

export default App;
```
**消费者**

```
import React, { Component } from 'react';
import PropTypes from 'prop-types'

/**
 * 第三层有A（生产者）层直接传递数据到此层C（消费者）
 */
class CppComponent extends React.Component {

   //消费者
   //子组件需要通过一个静态属性contextTypes声明后，才可以访问父组件Context对象的属性
  static contextTypes = {
    propA: PropTypes.string
  }

  render () {
    return(
      <div>
      	<p>从生产者传递过来的属性A：{this.context.propA}</p>
      </div>
    ) 
  }
}
export default CppComponent;
```
react升级后，Context的新API做了变更。

```
 type Context<T> = {
      Provider: Provider<T>,
      Consumer: Consumer<T>,
 };
```

**消费者**

```
import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import CppComponent from './Cpp.js';

const CommContext = React.createContext({
  a: 'aaaaa',
  b: 'bbbbb'
});

class App extends Component {

  //父组件
  constructor(props){
    super(props);
  }
  
  render() {    
    return(
      <CommContext.Provider>
        <BppComponent />
      </CommContext.Provider>
    )  
  }
}

class BppComponent extends React.Component {
  render () {
    return (
      <CppComponent>context跨层级传参实验</CppComponent>
    );
  }
}

export default App;
```
**消费者**

```
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

/**
 * 通过静态方法React.createContext()创建一个Context对象，
 * 这个Context对象包含两个组件，<Provider />和<Consumer />
 */
const CommContext = React.createContext({
  a: 'newaaaaa',
  b: 'newbbbbb'
});

/**
 * 第三层有A（生产者）层直接传递数据到此层C（消费者）
 */
class CppComponent extends React.Component {

  //消费者
  render () {
    return(
      <CommContext.Consumer>
        {
          context => (
            <div>
              {this.props.children} <br/>
              参数a: {context.a} <br/>
              参数b: {context.b} 
            </div>
          )}
      </CommContext.Consumer>
    ) 
  }
}
export default CppComponent;
```
**效果**
![context越级传参](https://img-blog.csdnimg.cn/20190109140726790.png)

**其他使用方式**
构造方法：

    constructor(props, context)

生命周期：

    componentWillReceiveProps(nextProps, nextContext)
    shouldComponentUpdate(nextProps, nextState, nextContext)
    componetWillUpdate(nextProps, nextState, nextContext)

>注入式的组件，类似背景、语言这种控制全局的变量，可使用context。

 ### 非嵌套组件间通信

 >非嵌套组件: 就是没有任何包含关系的组件,包括兄弟组件以及不再同一个父级的非兄弟组件。
使用事件订阅，即一个发布者，一个或多个订阅者。

#### 安装event

    npm install event -save

#### 新建Evt.js，导入events

    import {EventEmitter} from 'events';
    export default new EventEmitter();   

#### 发布者
通过emit事件触发方法，发布订阅消息给订阅者。
**发布者**
```
import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import Custom1 from './Custom1.js';
import Custom2 from './Custom2.js';
import emitter from './Evt.js';

class App extends Component {

  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    //emit事件触发方法,过事件名称找对应的事件处理函数callCustom，将事件处理函数作为参数传入
    emitter.emit('callCustom', 'Hello 我来发消息了');
  }

  render() {    
    return(
      <div>
        <br/>
        <button onClick = {this.handleClick}>点击发布事件</button>
        <Custom1 />
        <Custom2 />
      </div>
     
    )  
  }
}

export default App;
```
#### 订阅者
Custom1 和 Custom2
通过emitter.**addListener**(事件名称,函数名)方法，进行事件监听(订阅)。
通过emitter.**removeListener**(事件名称,函数名)方法 ，进行事件销毁(取消订阅)

**订阅者1**

```
import React from 'react';
import ReactDOM from 'react-dom';
import emitter from './Evt.js';

class Custom1 extends React.Component {

  constructor(){
    super();
    this.state= {
      msg:''
    }
  }

  componentDidMount () { //在组件挂载完成后声明一个自定义事件
    emitter.addListener('callCustom', (msg) => {
      this.setState({
        msg: 'Custom1收到消息--'+msg
      });
    })
  }

  componentWillUnmount () { //组件销毁前移除事件监听
    emitter.removeListener('callCustom', (msg) => {
      this.setState({
        msg: 'Custom1即将销毁此消息--'+ msg
      });
    })
  }

  //订阅者1消息显示
  render () {
     return(<p style={{color:'red'}}>
        {this.state.msg}
      </p>) 
  }
}
export default Custom1;
```

**订阅者2**

```
import React from 'react';
import ReactDOM from 'react-dom';
import emitter from './Evt.js';

class Custom2 extends React.Component {

  constructor(){
    super();
    this.state= {
      msg:''
    }
  }

  componentDidMount () { //在组件挂载完成后声明一个自定义事件
    emitter.addListener('callCustom', (msg) => {
      this.setState({
        msg: 'Custom2收到消息--'+msg
      })
    })
  }

  componentWillUnmount () { //组件销毁前移除事件监听
    emitter.removeListener('callCustom', (msg) => {
      this.setState({
        msg: 'Custom2即将销毁此消息--'+ msg
      })
    })
  }

  //订阅者2消息显示
  render () {
    return(<p style={{color:'blue'}}>{this.state.msg}</p>) 
  }
}
export default Custom2;
```
运行效果如下：
发布者发布消息前
![发布者发布消息前](https://img-blog.csdnimg.cn/20190109154003970.png)
订阅者接收消息后
![订阅者接收消息后](https://img-blog.csdnimg.cn/20190109154036101.png)

>文献资料
>非嵌套组件通信详解
>https://blog.csdn.net/bbgdebb/article/details/79006277
> node.js源码解析-events
>https://blog.csdn.net/leoleocs/article/details/50162065


