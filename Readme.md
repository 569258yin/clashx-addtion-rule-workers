# cloudflare worker for clashx rules
> 一个通过cloudflare work实现的对clash订阅文件附加自定义规则小程序

## 说明：
我使用的一个机场，偶尔bing.com打不开(被安全拦截,多次重定向，bing本身直连访问)；openai和claude打开会显示所在区域不合法（没有正确识别到需要使用🪜），不允许使用。造成这样的原因是订阅的规则集里没有正确的将这些域名走正确的🪜

![bing无法打开](/imagers/bing_error.png)

所以需要通过自定义规则进行配置，但我使用时发现有几个问题：

- 订阅文件设置每日更新，单纯修改订阅文件会被覆盖，不可行
- 订阅文件会用在各个电脑、手机等设备上，无法做到一处修改，全部生效
- 机场平台暂未发现以自定义规则的入口

<b>为了解决这些问题，我的思路是把文件下载下来，将自定义规则追加到原始文件中，重新生成一个订阅链接</b>

由于需要一个服务器进行交换，所以想到了白嫖cloudflare work 进行实现

## 使用：

### 1、创建worker
- 打开cloudflare官网：https://dash.cloudflare.com/
- 点击左侧菜单Workers和Pages，进入概述页面
- 点击创建、创建worker、输入名称、点击部署
![创建worker](/imagers/create_worker.png)

### 2、部署worker.js
- 部署成功后，点击刚创建的worker名称，进入详情
- 点击右上角编辑代码按钮
- 将worker.js代码全部copy到代码框中
![部署代码](/imagers/deploy_worker.png)

### 3、修改变量
- 在复制完成的worker.js代码中，最上面有三个变量
- passwd 设置访问密码
- configUrl 原始clashx的订阅地址
- additionRule 数组结构，添加自定义的规则
- 每次修改完成点击部署
![部署代码](/imagers/config.png)

### 4、订阅
- 在对应worker的详情页面，点击左上方访问按钮，调整到worker对应的url
- 在url后缀增加 ?passwd=xxxxx, xxxxx为你设置的密码，例如https://clashx-addtionrules.test1234.workers.dev/?passwd=29b3cbba
- 回车等待是否有文件下载，如果有下载打开，观察rules是否追加成功
- 成功后将新的workers对应的url填入clashx上替换掉原来的订阅地址

![部署代码](/imagers/rules.png)





