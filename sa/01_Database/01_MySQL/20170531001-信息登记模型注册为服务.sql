-- ==========================================================================================
-- 描述： 协作任务模型 API服务器注册数据
-- 时间：  2017-02-22 10:54:01
-- ==========================================================================================
-- 表名：app_baseservers -- 
USE `leadingcloud`;
-- 删除[app_baseservers]表数据 -- 
DELETE FROM `app_baseservers`  WHERE servergroup='InformationRegistModel';
-- 增加[app_baseservers]表数据 -- 
INSERT INTO `leadingcloud`.`app_baseservers` (`serverid`, `appid`, `http_webapi_host`, `http_webapi_port`, `http_html_host`, `http_html_port`, `https_webapi_host`, `https_webapi_port`, `https_html_host`, `https_html_port`, `sso`, `servergroup`) VALUES ('119028351254663186', NULL, '@localhost', '8434', NULL, NULL, '@localhost', '9434', NULL, NULL, NULL, 'InformationRegistModel');
-- ------ 导出数据 END --------- 