---
title: Hexo基础
tag: hexo
category: hexo
---


## 关于hexo
	https://hexo.io/zh-cn/docs/
	
	hexo官方文档连接地址
	
## 安装node和git
 请自行从网上查找适合自己系统和版本进行安装。

### node安装
	https://nodejs.org/zh-cn/
	
	自行配置Node.js环境
	
### git安装
	git 下载 https://git-scm.com/download
## Hexo
### 安装与启动部署
    npm install -g hexo-cli  //hexo插件安装
    hexo init blob //初始化hexo文件夹blob
	cd blob
	npm install
	hexo generate //可简写为hexo g
	hexo sever //可简写为hexo s

![启动服务](https://img-blog.csdnimg.cn/20181229161737386.png)
	访问 http://localhost:4000 

	Hello World 
 
### 上传GitHub

### 安装github插件
	npm install hexo-deployer-git --save //安装插件
	
### github注册以及配置
	(1) 没有GitHub的访问以下网站注册一个账户
		https://github.com
	(2) 建立资源库，例如blob
	(3) 在hexo中配置该仓库地址

### 本地站点github相关配置
    找到hexo安装目录blob文件夹，在站点配置文件_config.yml里修改如下配置：
    deploy:
  	  type: git
      repository: git@github.com:你的Github账户/仓库.git
      branch: master
### 部署静态文件到github
	通过git bash部署到github上
	hexo deploy //可简写为 hexo d 
	
   ### 域名关联gitpage
    
    (1) 阿里云域名配置
        在阿里云域名模块解析域名配置
        	将记录类型设置为CNAME；
        	记录值修改为 yourname.github.io
        在hexo安装目录中找到source文件夹
        	新建CNAME文件，没有后缀。
        	将你的域名放在新建的CNAME文件中。
    (2) GitHub Pages配置
        在blob资源仓库中Setting里，  下拉找到GitHub Pages部分
		配置 Custom domain，将你的域名填写进去，点击save。
		
![github pages](https://img-blog.csdnimg.cn/20181229170710433.png)
	

## 其他
	
	//清除缓存
	hexo clean 
	//生成静态网页
	hexo g
	//部署到git
	hexo d
	//本地服务启动
	hexo s
	
***	
> 比较简略，大体流程就是这些，个人觉得在自己动手查找过程会有更多的收获。
纸上得来终觉浅，觉知此事要躬行。——陆游

	


