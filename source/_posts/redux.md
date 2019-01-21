---
title: Redux
tag: React
category: React
date: 2019-01-21
---

### Redux
Redux 是 JavaScript 状态容器，提供可预测化的状态管理。
>1.应用中所有的状态都是以一个对象树的形式存储在一个单一的store中； 
2.当你想要改变应用的中的状态时，你就要dispatch一个action,这也是唯一的改变state的方法； 
3.通过编写reducer来维护状态，返回新的state,不直接修改原来数据；

**API**
https://www.redux.org.cn/

### 安装

    npm install --save redux

### 使用
阮一峰老师关于 Redux 入门教程说法很好：

> 首先，并非所有的 React 应用程序都需要使用 Redux 的。  如果你不确定是否使用 Rudex ，那么你就是不需要的。 
> 如果你遇到了无法解决的难题，那么 Rudex 可能就是你需要的东西。  Redux 的设计思想很简单，就两句话:
>> **1. 整个系统是一个状态机，视图与状态是一一对应的 
> >2. 所有的状态，保存在一个对象里面**

#### State
一个state对应着一个view，state改变，view跟着改变。

```
import { connect } from 'react-redux';
import { getSlideData } from 'actions/slides';

@connect((state) => ({ slideData: state.slideData }), { getSlideData })
```

    connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
    
官方API中说
>It does not modify the component class passed to it; instead, it returns a new, connected component class for you to use.

mapStateToProps(state, ownProps) 方法允许我们将store中的数据作为props绑定到组件中，只要store更新了就会调用mapStateToProps方法
mapStateToProps返回的结果必须是object对象，该对象中的值将会更新到组件中。
mapDispatchToProps(dispatch, [ownProps]) 第二个参数允许我们将action作为props绑定到组件中，mapDispatchToProps希望你返回包含对应action的object对象
#### Store
store是redux库中的createStore方法生成的对象，存储的是系统中的公有数据。

```
import { createStore, applyMiddleware } from 'redux';
const finalCreateStore = applyMiddleware(...middleware)(createStore);
```
**applyMiddleware**(科里化函数)主要是对redux的dispacth方法进行封装。
>柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。
>
用户的行为通过store.dispatch()来出发进行更改state

#### action
store.dispatch触发action,定义触发的动作。



>使用单独的模块或文件来定义 action type 常量并不是必须的，甚至根本不需要定义。对于小应用来说，使用字符串做 action type 更方便些。不过，在大型应用中把它们显式地定义成常量还是利大于弊的。

```
export const GET_SLIDES_LOADING = 'slides/loading';
export const GET_SLIDES_SUCCESS = 'slides/success';
export const GET_SLIDES_FAIL = 'slides/fail';

export function getSlideData() {
  return {
    types: [GET_SLIDES_LOADING, GET_SLIDES_SUCCESS, GET_SLIDES_FAIL],
    promise: (client) => client.get(client.API.Slides, { params: { page: 1, rows: 10 } })
  };
}

```
>我们应该尽量减少在 action 中传递的数据
#### Reducer
>Reducers 指定了应用状态的变化如何响应 actions 并发送到 store.

reducer就是一个纯函数，接收旧的 state 和 action，返回新的 state。

```
import { GET_SLIDES_LOADING, GET_SLIDES_SUCCESS, GET_SLIDES_FAIL } from 'actions/slides';

const initState = {
  isLoading: false,
  slideData: {},
  errorMsg: '',
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case GET_SLIDES_FAIL:
      return {
        ...state, isLoading: false, slideData: null, errorMsg: '请求错误啦',
      };
    case GET_SLIDES_LOADING:
      return {
        ...state, isLoading: true, slideData: null, errorMsg: '请求中...',
      };
    case GET_SLIDES_SUCCESS:
      return {
        ...state, isLoading: false, slideData: action.result.text, errorMsg: '获取成功',
      };
    default:
      return state;
  }
}

```
本次主要以一个首页轮播图的实现来实例整个流程。

Slider组件通过action把服务器响应(发生)请求送出来，获取轮播信息列表，reducer接收由store传入的请求action和旧的state(`(previousState, action) => newState`)，将返回结果按自己的格式更新到新的state返回，组件更新UI进行展示。

```
 case GET_SLIDES_SUCCESS:
      return {
        ...state, isLoading: false, slides: action.result, errorMsg: '获取成功',
      };
```
组件里获取数据展示

    componentDidMount() {
     this.props.getSlideData().then((data) => {
        const nd = JSON.parse(data);
        if (nd.head.success) {
          this.setState({
            slides: nd.body.rows
          });
        }
      }, (err) => {
        console.log(err);
      });
      setInterval(() => this.nextSlide(), 2000);
    }

***	

