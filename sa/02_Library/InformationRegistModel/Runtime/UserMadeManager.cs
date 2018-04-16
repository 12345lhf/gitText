using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.Framework.ModuleBase;
using System.Runtime.CompilerServices;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.DataModel.CodeTable;
using LeadingCloud.MISPT.Framework.DataExchanger.MISPT;
using LeadingCloud.MISPT.Framework.Common.Components;
using MongoDB.Bson;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/24 16:15:24
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime
{
    /// <summary>
    /// 
    /// </summary>
    public class UserMadeManager : ModuleManager
    {

        #region 构造函数、单例
        /// <summary>
        /// 构造方法
        /// </summary>
        private UserMadeManager()
        {
        }

        /// <summary>
        /// Manager实例
        /// </summary>
        public static UserMadeManager Instance { private set; get; }
        /// <summary>
        /// 应用编码
        /// </summary>
        public override string AppCode
        {
            get
            {
                return "InformationRegistModel";
            }
        }

        /// <summary>
        /// 静态构造方法
        /// </summary>
        [MethodImpl(MethodImplOptions.Synchronized)]
        static UserMadeManager()
        {
            //      静态实例，只初始化一次
            if (Instance == null) Instance = new UserMadeManager();
        }

        #endregion

        #region 接口
        /// <summary>
        /// 
        /// </summary>
        /// <param name="appCode">实际应用编码</param>
        /// <param name="businessModuleId">实际业务模块ID</param>
        /// <param name="sceneCode">实际场景编码</param>
        /// <param name="fields">支持用户定制的字段配置</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public void InitUserMade(string appCode, string businessModuleId, string sceneCode, List<ModelFieldConfig> fields, IServerContext sc)
        {
            //var radiusFields = fields.Where(m => m.ControlType == "radiolist" || m.ControlType == "dropdownlist").ToList();
            List<ModelFieldConfig> radiusFields = new List<ModelFieldConfig>();
            foreach (var item in fields)
            {
                if (item.ControlType == "radiolist" || item.ControlType == "dropdownlist")
                {
                    //BsonDocument config = BsonDocument.Parse(item.ControlConfig);
                    //if (GetValueByBool(config, "IsCustomized"))
                    //{
                        radiusFields.Add(item);
                    //}
                }
            }
            if (radiusFields.Count > 0)
            {
                //从代码表中获取【代码表节点】
                List<CodeTableNodeAPIModel> nodes = GetNodes(appCode, sceneCode, sc);
                if (nodes != null && nodes.Count > 0)
                {
                    List<CodeTableItemAPIModel> list = GetItems(appCode, businessModuleId, sceneCode, sc);
                    if (list != null)
                    {
                        var nodeItems = from node in nodes
                                        join item in list
                                        on node.Id equals item.CTId into newItem
                                        select new
                                        {
                                            Code = node.Code,
                                            Items = newItem
                                        };
                        foreach (var field in radiusFields)
                        {
                            BsonArray options = new BsonArray();
                            var tempNodes = nodeItems.Where(m => m.Code == field.FieldCode).ToList();
                            if (tempNodes != null)
                            {
                                var node = tempNodes.FirstOrDefault();
                                if (node != null)
                                {
                                    var items = node.Items;
                                    foreach (var item in items)
                                    {
                                        options.Add(item.Text);
                                    }

                                    //替换原有的
                                    BsonDocument controlConfig = BsonDocument.Parse(field.ControlConfig);
                                    if (options.Count > 0)
                                    {
                                        controlConfig.SetElement(new BsonElement("Options", options));
                                        field.ControlConfig = controlConfig.ToJson();
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }

        /// <summary>
        /// 获取代码表节点
        /// </summary>
        /// <param name="appCode"></param>
        /// <param name="sceneCode"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public List<CodeTableNodeAPIModel> GetNodes(string appCode, string sceneCode, IServerContext sc)
        {
            Func<ServerContextInfo, List<CodeTableNodeAPIModel>> func = (info) =>
           {
               return CodeTableExchanger.GetNodes(appCode, sceneCode, sc);
           };
            return this.CallFuncForContextInfo<List<CodeTableNodeAPIModel>>(func, sc, "GetNodes", "获取代码表节点失败");
        }

        /// <summary>
        /// 获取代码表项
        /// </summary>
        /// <param name="appCode"></param>
        /// <param name="businessModuleId"></param>
        /// <param name="sceneCode"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public List<CodeTableItemAPIModel> GetItems(string appCode, string businessModuleId, string sceneCode, IServerContext sc)
        {
            Func<ServerContextInfo, List<CodeTableItemAPIModel>> func = (info) =>
            {
                return CodeTableExchanger.GetItems(appCode, businessModuleId, sceneCode, sc);
            };
            return this.CallFuncForContextInfo<List<CodeTableItemAPIModel>>(func, sc, "GetItems", "获取代码表项失败");
        }


        #region 暂时没用

        /// <summary>
        /// 添加代码表分组
        /// </summary>
        /// <param name="appCode"></param>
        /// <param name="sceneCode"></param>
        /// <param name="items"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public List<CodeTableItemAPIModel> SaveOption2CodeTableItem(string appCode, string sceneCode, List<CodeTableItemAPIModel> items, IServerContext sc)
        {
            Func<ServerContextInfo, List<CodeTableItemAPIModel>> func = (info) =>
             {
                 if (string.IsNullOrEmpty(appCode)) ThrowArgException("appCode不能为空");
                 if (string.IsNullOrEmpty(sceneCode)) ThrowArgException("sceneCode不能为空");
                 if (items.Count == 0) ThrowArgException("要添加的代码表项不能为空");

                 var serverNodes = CodeTableExchanger.AddItems(appCode, sceneCode, items, sc);
                 if (serverNodes != null && serverNodes.Count == 0)
                 {
                     ThrowErrorCodeException("添加代码表项失败");
                 }
                 return serverNodes;
             };
            return this.CallFuncForContextInfo<List<CodeTableItemAPIModel>>(func, sc, "SaveOptions2CodeTable", "将选项信息添加代码表项失败");
        }

        /// <summary>
        /// 添加代码表项
        /// </summary>
        /// <param name="appCode"></param>
        /// <param name="sceneCode"></param>
        /// <param name="nodes"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public List<CodeTableNodeAPIModel> SaveField2CodeTableNode(string appCode, string sceneCode, List<CodeTableNodeAPIModel> nodes, IServerContext sc)
        {
            Func<ServerContextInfo, List<CodeTableNodeAPIModel>> func = (info) =>
             {
                 if (string.IsNullOrEmpty(appCode)) ThrowArgException("appCode不能为空");
                 if (string.IsNullOrEmpty(sceneCode)) ThrowArgException("sceneCode不能为空");
                 if (nodes.Count == 0) ThrowArgException("要添加的代码表分组不能为空");

                 var serverNodes = CodeTableExchanger.AddNodes(nodes, sc);
                 if (serverNodes != null && serverNodes.Count == 0)
                 {
                     ThrowErrorCodeException("添加代码表分组失败");
                 }

                 return serverNodes;
             };
            return this.CallFuncForContextInfo<List<CodeTableNodeAPIModel>>(func, sc, "SaveField2CodeTableNode", "将字段信息添加代码表分组失败");
        }


        /// <summary>
        /// 对比更新代码表分组
        /// </summary>
        /// <param name="appCode"></param>
        /// <param name="sceneCode"></param>
        /// <param name="nodes">当前所有项</param>
        /// <param name="sc"></param>
        /// <returns>返回新增加的组的集合</returns>
        public List<CodeTableNodeAPIModel> UpdateField2CodeTableNode(string appCode, string sceneCode, List<CodeTableNodeAPIModel> nodes, IServerContext sc)
        {
            Func<ServerContextInfo, List<CodeTableNodeAPIModel>> func = (info) =>
             {
                 if (string.IsNullOrEmpty(appCode)) ThrowArgException("appCode不能为空");
                 if (string.IsNullOrEmpty(sceneCode)) ThrowArgException("sceneCode不能为空");
                 if (nodes.Count == 0) ThrowArgException("要添加的代码表分组不能为空");
                 List<CodeTableNodeAPIModel> dbNodes = GetNodes(appCode, sceneCode, sc);
                 //过滤出需要更新的项
                 List<CodeTableNodeAPIModel> needUpdate = FilterRepeatNode(nodes, dbNodes);
                 //判断需要更新的项，如果没有则直接返回
                 if (needUpdate.Count == 0)
                 {
                     return new List<CodeTableNodeAPIModel>();
                 }
                 var serverNodes = this.SaveField2CodeTableNode(appCode, sceneCode, nodes, sc);
                 if (serverNodes != null && serverNodes.Count == 0)
                 {
                     ThrowErrorCodeException("添加代码表分组失败");
                 }

                 return serverNodes;
             };
            return this.CallFuncForContextInfo<List<CodeTableNodeAPIModel>>(func, sc, "UpdateField2CodeTableNode", "将字段信息添加代码表分组失败");
        }

        /// <summary>
        /// 对比更新代码表项
        /// </summary>
        /// <param name="appCode"></param>
        /// <param name="businessModuleId"></param>
        /// <param name="sceneCode"></param>
        /// <param name="items"></param>
        /// <param name="sc"></param>
        /// <returns>返回新增加的项集合</returns>
        public List<CodeTableItemAPIModel> UpdateOption2CodeTableItem(string appCode, string businessModuleId, string sceneCode, List<CodeTableItemAPIModel> items, IServerContext sc)
        {
            Func<ServerContextInfo, List<CodeTableItemAPIModel>> func = (info) =>
             {
                 if (string.IsNullOrEmpty(appCode)) ThrowArgException("appCode不能为空");
                 if (string.IsNullOrEmpty(businessModuleId)) ThrowArgException("businessModuleId不能为空");
                 if (string.IsNullOrEmpty(sceneCode)) ThrowArgException("sceneCode不能为空");
                 if (items.Count == 0) ThrowArgException("要添加的代码表项不能为空");
                 List<CodeTableItemAPIModel> dbItems = GetItems(appCode, businessModuleId, sceneCode, sc);
                 //过滤出需要更新的项
                 List<CodeTableItemAPIModel> needUpdate = FilterRepeatItem(items, dbItems);
                 //判断需要更新的项，如果没有则直接返回
                 if (needUpdate.Count == 0)
                 {
                     return new List<CodeTableItemAPIModel>();
                 }
                 var serverNodes = this.SaveOption2CodeTableItem(appCode, sceneCode, items, sc);
                 if (serverNodes != null && serverNodes.Count == 0)
                 {
                     ThrowErrorCodeException("添加代码表项失败");
                 }
                 return serverNodes;
             };
            return this.CallFuncForContextInfo<List<CodeTableItemAPIModel>>(func, sc, "SaveOptions2CodeTable", "将选项信息添加代码表项失败");
        }

        #endregion

        #endregion


        #region 私有

        /// <summary>
        /// 过滤代码表分组
        /// </summary>
        /// <param name="nowList">对比前的所有分组</param>
        /// <param name="dbList">数据库的所有分组</param>
        /// <returns></returns>
        private List<CodeTableNodeAPIModel> FilterRepeatNode(List<CodeTableNodeAPIModel> nowList, List<CodeTableNodeAPIModel> dbList)
        {
            return nowList.Where(m => dbList.FindIndex(n => n.Code == m.Code && n.AppCode == n.AppCode) < 0).ToList();
        }

        /// <summary>
        /// 过滤代码表项
        /// </summary>
        /// <param name="nowList">对比前的所有项</param>
        /// <param name="dbList">数据库的所有项</param>
        /// <returns></returns>
        private List<CodeTableItemAPIModel> FilterRepeatItem(List<CodeTableItemAPIModel> nowList, List<CodeTableItemAPIModel> dbList)
        {
            return nowList.Where(m => dbList.FindIndex(n => n.Text == m.Text) < 0).ToList();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="bd"></param>
        /// <returns></returns>
        private CodeTableItemAPIModel Bson2ItemModel(BsonDocument bd)
        {
            CodeTableItemAPIModel model = new CodeTableItemAPIModel();
            model.Id = GetElement(bd, "Id").Value.ToString();
            model.CTId = GetElement(bd, "CTId").Value.ToString();
            model.Sort = Convert.ToInt32(GetElement(bd, "Sort").Value.ToString());
            model.Text = GetElement(bd, "Text").Value.ToString();
            return model;
        }
        private CodeTableNodeAPIModel Bson2NodeModel(BsonDocument bd)
        {
            CodeTableNodeAPIModel model = new CodeTableNodeAPIModel();
            model.Id = GetValue(bd, "Id");
            model.Code = GetValue(bd, "Code");
            model.Name = GetValue(bd, "Name");
            model.GroupCode = GetValue(bd, "GroupCode");
            model.GroupName = GetValue(bd, "GroupName");
            model.AppCode = GetValue(bd, "AppCode");
            model.SceneCode = GetValue(bd, "SceneCode");
            return model;
        }

        #region BsonDocument 辅助功能
        /// <summary>
        /// 如果为Null返回""
        /// </summary>
        /// <param name="document"></param>
        /// <returns></returns>
        private string IsNull2Empety(BsonDocument document)
        {
            if (document == null)
            {
                return "";
            }
            else
            {
                var result = document.ToJson(new MongoDB.Bson.IO.JsonWriterSettings() { OutputMode = MongoDB.Bson.IO.JsonOutputMode.Strict });
                return result;
            }
        }
        /// <summary>
        /// 获取BsonElement，如果不存在则返回一个Name和Value都为Null的BsonElement
        /// </summary>
        /// <param name="document"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        private BsonElement GetElement(BsonDocument document, string name)
        {
            BsonElement element = new BsonElement();
            document.TryGetElement(name, out element);
            return element;
        }
        /// <summary>
        /// 获取BsonElement的值
        /// </summary>
        /// <param name="document"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        private string GetValue(BsonDocument document, string name)
        {
            BsonElement element = new BsonElement();
            document.TryGetElement(name, out element);
            if (element.Value == null) return string.Empty;
            return element.Value.ToString();
        }
        private int GetValueByInt(BsonDocument document, string name)
        {
            BsonElement element = new BsonElement();
            document.TryGetElement(name, out element);
            if (element.Value == null) return int.MinValue;
            return element.Value.AsInt32;
        }
        private bool GetValueByBool(BsonDocument document, string name)
        {
            BsonElement element = new BsonElement();
            document.TryGetElement(name, out element);
            if (element.Value == null) return false;
            return element.Value.AsBoolean;
        }
        /// <summary>
        /// 检查是否包含元素，如果包含返回true
        /// </summary>
        /// <param name="document"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        private bool HasElement(BsonDocument document, string name)
        {
            BsonElement element = new BsonElement();
            document.TryGetElement(name, out element);
            return !string.IsNullOrEmpty(element.Name);
        }
        #endregion
        #endregion
    }
}
