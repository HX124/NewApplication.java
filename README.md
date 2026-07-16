# FMEA 管理系统

一个基于 Spring Boot 的 FMEA（失效模式与影响分析）管理系统，提供完整的项目管理、用户认证和分析功能。

## 项目简介

本项目是一个功能完整的 FMEA 管理系统，采用 Spring Boot 框架开发，后端提供 RESTful API，前端使用 HTML/CSS/JavaScript 构建交互式界面。系统支持多用户协作，包含项目管理、失效分析、风险评估、标准库管理等功能。

## 技术栈

- **后端**: Spring Boot + Spring Data JPA + MySQL
- **前端**: HTML5 + CSS3 + JavaScript + ECharts
- **数据库**: MySQL
- **构建工具**: Maven (含 Maven Wrapper)
- **端口**: 8088

## 运行环境要求

- **JDK**: 8 或更高版本
- **Maven**: 3.x (如果未安装，可使用项目自带的 `./mvnw`)
- **MySQL**: 5.7 或 8.0 版本

## 快速开始

### 1. 克隆项目
打开终端（CMD 或 Git Bash），执行以下命令将项目下载到本地：
```bash
git clone https://gitee.com/HX124/NewApplication.java.git
```

### 2. 配置文件与数据库准备（重要！）
项目默认使用 `src/main/resources/application.properties` 作为配置文件。
2.1 **创建数据库**：请提前登录本地的 MySQL，新建一个空数据库（例如命名为 `fmea_db`）。
2.2 **配置数据库连接**：打开 `src/main/resources/application.properties` 文件，修改以下数据库连接信息，请**务必替换为您本地的真实账号和密码**：
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fmea_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=您的本地MySQL密码
```
> 💡 **安全提示**：如需将此项目开源或作为模板分享，请**不要**将带有真实密码的 `application.properties` 提交到 Git 仓库。建议新建一个 `application-template.properties` 模板文件（密码留空或写 `123456`）提交，这样其他开发者克隆后，只需将模板复制并重命名为 `application.properties` 即可。

### 3. 构建与启动
项目已集成 Maven Wrapper（即图中的 `mvnw` 和 `mvnw.cmd`），您无需在电脑上全局安装 Maven。
- **Windows 系统**（在项目根目录下运行）：
  ```cmd
  mvnw.cmd clean package
  mvnw.cmd spring-boot:run
  ```
- **Mac/Linux 系统**：
  ```bash
  ./mvnw clean package
  ./mvnw spring-boot:run
  ```

### 4. 访问系统
启动成功后，在浏览器中打开以下地址即可访问：
```
http://localhost:8088
```

## 常见问题与解决方案（排坑指南）

运行过程中如果遇到以下问题，请对照解决方案逐条排查：

**Q1：项目启动时报错 `Access denied for user 'root'@'localhost'` 或 `Unknown database 'fmea_db'`**
- **原因**：`application.properties` 中填写的 MySQL 密码错误，或者指定的数据库名称在 MySQL 中根本不存在。
- **解决方案**：检查并修正 `application.properties` 中的账号、密码，并确保已在 MySQL 中手动执行 `CREATE DATABASE fmea_db;` 建好空数据库。

**Q2：项目启动成功，但访问页面时提示 `Table 'fmea_db.xxx' doesn't exist`**
- **原因**：数据库虽然连上了，但 Spring Data JPA 没有自动根据代码创建出对应的数据表。
- **解决方案**：检查 `application.properties` 中是否开启了自动建表。在 `spring.datasource.url` 下方添加配置：`spring.jpa.hibernate.ddl-auto=update`（添加后重启项目即可自动建表）。如果依然不行，请检查您的 MySQL 用户是否拥有建表权限。

**Q3：启动时报错 `Web server failed to start. Port 8088 was already in use.`**
- **原因**：您电脑上的其他程序（如另一个 Java 进程）已经占用了 8088 端口。
- **解决方案**：
  1. 方法一：在 `application.properties` 中添加或修改 `server.port=8089`（换成其他未被占用的端口）后重启。
  2. 方法二：打开任务管理器，找到占用 8088 端口的 Java 进程并结束它。

**Q4：执行 `./mvnw` 时，下载依赖非常慢或失败**
- **原因**：Maven 默认使用的是国外的中央仓库下载源，国内网络访问较慢。
- **解决方案**：在项目根目录下的 `pom.xml` 中添加阿里云的镜像配置，或者（更推荐）在您本地 `~/.m2/settings.xml` 文件中配置阿里云镜像，加速依赖下载。

**Q5：克隆后，项目中莫名其妙多了很多 `target/` 或 `.idea/` 文件夹**
- **原因**：这说明项目根目录下缺少 `.gitignore` 文件，或者该文件未提交到远程仓库，导致本地的编译产物和 IDE 配置被推送到 Git 中，污染了仓库。
- **解决方案**：请在项目根目录下创建并提交 `.gitignore` 文件，内容必须包含以下关键排除项，这样下次 `git add .` 时就不会把无用的缓存文件传上去了：
  ```
  target/
  .idea/
  .DS_Store
  *.class
  *.jar
  application.properties
  ```

## 许可证

本项目仅供学习和参考使用。