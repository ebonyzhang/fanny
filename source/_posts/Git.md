---
title: Git
tag: Git
category: Git
date: 2019-01-11
---

## Git

将当前目录下修改的所有代码从工作区添加到暂存区 . 代表当前目录
```
git add . 
```
将缓存区内容添加到本地仓库
```
git commit -m '注释'
```
推送到远程服务器
```
git push
```

## 其他
添加到暂存区时，出现很多untrack
```
git clean -f
```

之后，重新进行了添加，有个问题是将一些不需要的模块也上传了上去，于是做了清理以及重新添加提交等操作。

```
git add * 
```
查看当前仓库中文件的状态。

```
git status
```
如果没有问题，进行提交到本地仓库，最后推送到远程服务器。

查看当前分支
```
git branch        
```
更新代码到本地  
```
git pull              
```
此次将博客维护在了github上方便多台电脑操作，node_modules模块实在没必要上传维护，创建.gitignore文件,将不需要的文件夹配置在里面，
被ignore的文件肯定不会被标上untracked，上面的问题就是显示红字untracked。
在其他电脑上使用npm重新安装就可以，每次在更新博客时，要重新pull。

.gitignore文件配置
```
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
```

***	
	
>所有事情到最后都会是好事，如果还不是，那她还没到最后——约翰*列侬 
