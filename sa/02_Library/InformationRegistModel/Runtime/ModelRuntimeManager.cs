using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.CompilerServices;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Interfaces;
using MongoDB.Bson;
using LeadingCloud.MISPT.InformationRegistModel.Design;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Components;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.FromControlVerify;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Enumerations;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Utils;
using LeadingCloud.MISPT.Framework.Common.Components;
using LeadingCloud.MISPT.Framework.ModuleBase;
using LeadingCloud.MISPT.Framework.DataExchanger.Plat;
using LeadingCloud.Core.DataModel.Resource;
using LeadingCloud.MISPT.DataModel.Common;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.InformationRegistModel.Design.Enumerations;
using LeadingCloud.MISPT.InformationRegistModel.Design.Utils;
using LeadingCloud.MISPT.Framework.DataExchanger;
using LeadingCloud.Core.DataModel.App;



/*********************************************************
 * 创建者：lz-wjs
 * 创建日期：2017/05/31 11:20:19
 * 机器名称：WJS
 * 描述：信息登记模型模块运行时管理类
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime
{
    /// <summary>
    /// 信息登记模型模块运行时管理类
    /// </summary>
    public class ModelRuntimeManager : ModuleManager
    {
        #region 构造函数、单例
        /// <summary>
        /// 构造方法
        /// </summary>
        private ModelRuntimeManager()
        {
        }

        /// <summary>
        /// Manager实例
        /// </summary>
        public static ModelRuntimeManager Instance { private set; get; }
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
        static ModelRuntimeManager()
        {
            //      静态实例，只初始化一次
            if (Instance == null) Instance = new ModelRuntimeManager();
        }

        #endregion


        #region 配置信息

        /// <summary>
        /// 获取模块配置信息
        /// </summary>
        /// <param name="appCode">应用编码</param>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <param name="sc">上下文</param>
        /// <param name="isIncludeUserExtendFields">是否包含用户扩展字段（在运行时用户扩展属性配置界面用）</param>
        /// <returns></returns>
        public string GetModuleInfo(string appCode, string businessModuleId, string sceneCode, string sceneOrgId, IServerContext sc, bool isIncludeUserExtendFields = true)
        {
            Func<ServerContextInfo, string> func = (info) =>
            {
                ModelPublishData designInfo = GetDesignModel(businessModuleId, sc);
                if (designInfo == null)
                {
                    ThrowArgException("不存在businessModuleId为" + businessModuleId + "的模块");
                }

                ////添加内置列表字段
                //BuildBaseListField(designInfo);

                //支持用户定制
                UserMadeManager.Instance.InitUserMade(appCode, businessModuleId, sceneCode, designInfo.FormConfig.Fields, sc);

                if (isIncludeUserExtendFields)
                {


                    //用户自定义数据
                    var userExtendFields = ModelUserDefinedFieldManager.Instance.GetModulUserFields(businessModuleId, appCode, sceneOrgId, sc);
                    foreach (var item in userExtendFields)
                    {
                        designInfo.FormConfig.Fields.Add(UserField2ModleField(item));

                        //以下注释部分是由于原型修改--用户自定义属性不在列表中显示，所以以下配置都不需要管了
                        //if (item.IsShowForm)
                        //{
                        //    designInfo.FormConfig.Fields.Add(UserField2ModleField(item));
                        //}
                        //if (item.IsShowList)
                        //{
                        //    designInfo.ListConfig.ShowFields.Add(UserField2ModleListField(item));
                        //}
                        designInfo.Propertys.Add(new ModelPropertyConfig() { FieldCode = item.FieldCode, FieldName = item.FieldName });
                    }
                }

                //组装设计时和用户自定义的数据
                var modelInfo = BsonDocument.Parse(Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    Id = designInfo.Id,
                    Name = designInfo.Name,
                    Description = designInfo.Description,
                    Propertys = designInfo.Propertys,
                    FormConfig = new
                    {
                        Fields = designInfo.FormConfig.Fields,
                        //UserExtendFields = userExtendFields,
                    },
                    ListConfig = designInfo.ListConfig,
                    ExtendConfig = designInfo.ExtendConfig
                }));
                return modelInfo.ToString();
            };
            return this.CallFuncForContextInfo<string>(func, sc, "GetModuleInfo", "保存数据");
        }

        /// <summary>
        /// 获取设计时发布后的模块配置信息（未经过其他过程处理）
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        private ModelPublishData GetDesignModel(string businessModuleId, IServerContext sc)
        {
            var modelId = GetModelId(businessModuleId, sc);
            //设计时数据
            var designInfo = ModelDesignManager.Instance.GetPublishModel(modelId, sc);
            return designInfo;
        }

        /// <summary>
        /// 验证模块ID集合，返回经过验证的ID集合
        /// </summary>
        /// <param name="modelIdsJSON"></param>
        /// <param name="sc"></param>
        /// <example>
        /// POST数据示例：{modelIds:[id1,id2,id...]}
        /// </example>
        /// <returns></returns>
        public List<string> VerifyModelIds(string modelIdsJSON, IServerContext sc)
        {
            Func<ServerContextInfo, List<string>> func = (info) =>
            {
                List<BsonValue> modules = GetElement(BsonDocument.Parse(modelIdsJSON), "modelIds").Value.AsBsonArray.ToList();
                List<string> moduleIds = new List<string>();
                foreach (var item in modules)
                {
                    moduleIds.Add(item.AsString);
                }
                var moduleList = ModelDesignManager.Instance.GetPublishModels(moduleIds, sc);
                if (moduleList == null)
                {
                    moduleList = new List<Design.Components.ModelPublishData>();
                }
                return (from model in moduleList select model.Id).ToList();
            };
            return this.CallFuncForContextInfo<List<string>>(func, sc, "VerifyModelIds", "验证模块信息失败");
        }

        /// <summary>
        /// 验证模块ID集合，返回经过验证的模块信息集合
        /// </summary>
        /// <param name="modelIdsJSON"></param>
        /// <param name="sc"></param>
        /// <example>
        /// POST数据示例：{modelIds:[id1,id2,id...]}
        /// </example>
        /// <returns></returns>
        public List<ModelPublishData> VerifyModelIdsForModelInfo(string modelIdsJSON, IServerContext sc)
        {
            Func<ServerContextInfo, List<ModelPublishData>> func = (info) =>
            {
                List<BsonValue> modules = GetElement(BsonDocument.Parse(modelIdsJSON), "modelIds").Value.AsBsonArray.ToList();
                List<string> moduleIds = new List<string>();
                foreach (var item in modules)
                {
                    moduleIds.Add(item.AsString);
                }
                var moduleList = ModelDesignManager.Instance.GetPublishModels(moduleIds, sc);
                if (moduleList == null)
                {
                    moduleList = new List<Design.Components.ModelPublishData>();
                }
                return moduleList;
            };
            return this.CallFuncForContextInfo<List<ModelPublishData>>(func, sc, "VerifyModelIdsForModelInfo", "验证模块信息失败");
        }

        /// <summary>
        /// 根据业务模块ID获取信息登记模型模块ID（技术模块ID）
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public string GetModelId(string businessModuleId, IServerContext sc)
        {
            Func<ServerContextInfo, string> func = (info) =>
          {
              var result = BaseExchanger.Get_DataContext<AppModuleModel>("api/appmodule/getappmodulebybussguid", "/" + businessModuleId + "/{tokenId}", sc);
              if (result != null)
              {
                  return result.codeguid;
              }
              else
              {
                  ThrowNullArgException("调用平台接口获取模块信息失败");
              }

              return businessModuleId;
          };
            return this.CallFuncForContextInfo<string>(func, sc, "VerifyModelIds", "调用平台接口获取模块信息失败");
        }

        /// <summary>
        /// 获取模块的字段配置（不包含用户自定义的）
        /// </summary>
        /// <param name="appCode">应用编码</param>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public List<FieldVerify> GetFieldConfig(string appCode, string businessModuleId, string sceneCode, string sceneOrgId, IServerContext sc)
        {
            var modelInfo = BsonDocument.Parse(GetModuleInfo(appCode, businessModuleId, sceneCode, sceneOrgId, sc));
            var formConfig = modelInfo[BaseConfigField.FormConfig];
            var fields = formConfig[BaseConfigField.FormFields].AsBsonArray;
            List<FieldVerify> result = new List<FieldVerify>();
            if (fields != null)
            {
                foreach (var item in fields)
                {
                    ControlVerifyBase verify = GetControAdapter(item[BaseConfigField.ControlType].AsString, item.ToString());
                    result.Add(new FieldVerify()
                    {
                        FieldName = item[BaseConfigField.FieldName].AsString,
                        FieldCode = item[BaseConfigField.FieldCode].AsString,
                        ControlType = item[BaseConfigField.ControlType].AsString,
                        Verifiable = verify
                    });
                }
            }
            return result;
        }

        /// <summary>
        /// 获取列表字段集合
        /// </summary>
        /// <param name="appCode">应用编码</param>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public List<BsonValue> GetListField(string appCode, string businessModuleId, string sceneCode, string sceneOrgId, IServerContext sc)
        {
            var modelInfo = BsonDocument.Parse(GetModuleInfo(appCode, businessModuleId, sceneCode, sceneOrgId, sc));
            var listConfig = modelInfo[BaseConfigField.ListConfig];
            var fields = listConfig[BaseListConfigField.ShowFields].AsBsonArray;
            return fields.ToList();
        }




        /// <summary>
        /// 获取模块的属性配置
        /// </summary>
        /// <param name="appCode">应用编码</param>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public List<ModelPropertyConfig> GetPropertys(string appCode, string businessModuleId, string sceneCode, string sceneOrgId, IServerContext sc)
        {
            var modelInfo = BsonDocument.Parse(GetModuleInfo(appCode, businessModuleId, sceneCode, sceneOrgId, sc));
            var fields = modelInfo[BaseConfigField.Propertys].AsBsonArray;
            List<ModelPropertyConfig> result = new List<ModelPropertyConfig>();
            foreach (var item in fields)
            {
                BsonDocument doc = item.AsBsonDocument;
                result.Add(new ModelPropertyConfig()
                {
                    FieldCode = GetValue(doc, "FieldCode"),
                    FieldName = GetValue(doc, "FieldName")
                });
            }
            return result;

        }



        /// <summary>
        /// 判断是属性是否在配置中存在
        /// </summary>
        /// <param name="appCode">应用编码</param>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <param name="fields">需要验证的属性名(FieldCode)</param>
        /// <param name="sc"></param>
        /// <returns>返回不存在的属性</returns>
        public List<string> CheckHasProperty(string appCode, string businessModuleId, string sceneCode, string sceneOrgId, List<string> fields, IServerContext sc)
        {
            Func<ServerContextInfo, List<string>> func = (info) =>
            {
                var propertys = this.GetPropertys(appCode, businessModuleId, sceneCode, sceneOrgId, sc);
                List<string> result = new List<string>();
                foreach (var item in fields)
                {
                    if (propertys.FindIndex((property) => { return property.FieldCode == item; }) == -1)
                    {
                        result.Add(item);
                    }
                }
                return result;
            };
            return this.CallFuncForContextInfo<List<string>>(func, sc, "HasField", "查询是否包含字段失败");
        }

        #region 私有方法


        /// <summary>
        /// 默认需要的字段
        /// </summary>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        private List<FieldVerify> GetBaseFieldConfig(IServerContext sc)
        {
            List<FieldVerify> baseField = new List<FieldVerify>();
            Dictionary<string, string> baseDics = new Dictionary<string, string>();
            baseDics.Add(BaseField.Id, "登记单编码");
            baseDics.Add(BaseField.CreateTime, "创建时间");
            baseDics.Add(BaseField.CreateUserId, "创建人");
            baseDics.Add(BaseField.CreateUserFaceId, "创建人头像ID");
            baseDics.Add(BaseField.OrganizationId, "创建人组织机构编码");
            baseDics.Add(BaseField.AppCode, "应用编码");
            baseDics.Add(BaseField.BusinessModuleId, "业务模块编码");
            baseDics.Add(BaseField.SceneCode, "场景编码");
            baseDics.Add(BaseField.ResoucePoolId, "资源池编码");
            baseDics.Add(BaseField.Members, "成员");
            foreach (var item in baseDics)
            {
#warning 暂时不对内置的字段进行数据验证 WJS
                ControlVerifyBase verify = null;
                baseField.Add(new FieldVerify()
                {
                    FieldName = item.Value,
                    FieldCode = item.Key,
                    Verifiable = verify
                });
            }
            return baseField;

        }

        /// <summary>
        /// 判断是否是资源控件
        /// </summary>
        /// <param name="controlType">控件类型</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        private bool IsResouceControl(string controlType, IServerContext sc)
        {
            ControlEntity model = ControlManager.Instance.GetControlByCode(controlType, sc);
            if (model != null)
            {
                return model.ControlType == ControlType.Resouce.ToString();
            }
            return false;
        }

        /// <summary>
        /// 获取控件集合
        /// </summary>
        /// <param name="sc"></param>
        /// <param name="fieldTypes"></param>
        /// <returns></returns>
        private List<ControlEntity> GetResouceControls(IServerContext sc, List<string> fieldTypes)
        {
            List<ControlEntity> controls = ControlManager.Instance.GetControlsByCode(fieldTypes, sc);
            List<ControlEntity> resouceTypes = (from c in controls
                                                where c.ControlType.Equals(((int)ControlType.Resouce).ToString(), StringComparison.CurrentCultureIgnoreCase)
                                                select c).ToList();
            return resouceTypes;
        }

        /// <summary>
        /// 获取控件code集合
        /// </summary>
        /// <param name="sc"></param>
        /// <param name="fieldTypes"></param>
        /// <returns></returns>
        private List<string> GetResouceControlsCode(IServerContext sc, List<string> fieldTypes)
        {
            return (from c in GetResouceControls(sc, fieldTypes) select c.Code).ToList();
        }

        /// <summary>
        /// 根据控件类型获取对应的验证类
        /// </summary>
        /// <param name="controlType"></param>
        /// <param name="configJson"></param>
        /// <returns></returns>
        private ControlVerifyBase GetControAdapter(string controlType, string configJson)
        {
            return new TextVerifyAdapter(configJson);
        }

        /// <summary>
        /// 检查列表字段是否能查询
        /// </summary>
        /// <param name="appCode">应用编码</param>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <param name="checkFields"></param>
        /// <param name="sc"></param>
        private void CheckListFieldsForSearch(string appCode, string businessModuleId, string sceneCode, string sceneOrgId, List<string> checkFields, IServerContext sc)
        {
            var fields = GetListField(appCode, businessModuleId, sceneCode, sceneOrgId, sc);
            foreach (var item in checkFields)
            {
                var field = fields.Find(m => GetElement(m.AsBsonDocument, BaseListConfigField.FieldCode).Value == item);
                if (field == null) ThrowArgException(string.Format("字段{0}不支持在列表中显示", BaseListConfigField.FieldCode));
                if (!(GetElement(field.AsBsonDocument, BaseListConfigField.IsSupportSearch).Value.AsBoolean)) ThrowArgException(string.Format("字段{0}不支持在查询", BaseListConfigField.FieldCode));
            }
        }

        /// <summary>
        /// 检查列表字段是否能排序
        /// </summary>
        /// <param name="appCode">应用编码</param>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <param name="checkFields"></param>
        /// <param name="sc"></param>
        private void CheckListFieldsForSort(string appCode, string businessModuleId, string sceneCode, string sceneOrgId, List<string> checkFields, IServerContext sc)
        {
            var fields = GetListField(appCode, businessModuleId, sceneCode, sceneOrgId, sc);
            foreach (var item in checkFields)
            {
                var field = fields.Find(m => GetElement(m.AsBsonDocument, BaseListConfigField.FieldCode).Value == item);
                if (field == null) ThrowArgException(string.Format("字段{0}不支持在列表中显示", BaseListConfigField.FieldCode));
                if (!(GetElement(field.AsBsonDocument, BaseListConfigField.IsSupportSort).Value.AsBoolean)) ThrowArgException(string.Format("字段{0}不支持在排序", BaseListConfigField.FieldCode));
            }
        }

        #endregion


        #endregion

        #region 业务数据接口

        #region 增删改


        /// <summary>
        /// 添加登记单
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <param name="entity">业务实体</param>
        /// <param name="sc">上下文信息</param>
        /// <returns></returns>
        public string AddInformation(string businessModuleId, string sceneCode, string sceneOrgId, string entity, IServerContext sc)
        {
            Func<ServerContextInfo, string> func = (info) =>
           {
               return IsNull2Empety(BaseAddInformation(businessModuleId, sceneCode, entity, sc, null, sceneOrgId));
           };
            return this.CallFuncForContextInfo<string>(func, sc, "AddInformation", "新增登记单失败");
        }

        /// <summary>
        /// 更新登记单
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="entity">业务实体</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public string UpdateInformation(string businessModuleId, string sceneCode, string entity, IServerContext sc)
        {
            Func<ServerContextInfo, string> func = (info) =>
           {
               return IsNull2Empety(BaseUpdateInformation(businessModuleId, sceneCode, entity, sc, null, false));
           };
            return this.CallFuncForContextInfo<string>(func, sc, "UpdateInformation", "更新登记单失败");
        }

        /// <summary>
        /// 删除登记单
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="taskId">任务ID</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public bool DeleteInformation(string businessModuleId, string sceneCode, string taskId, IServerContext sc)
        {
            Func<ServerContextInfo, bool> func = (info) =>
           {
               ValidBsinnessModuleIdAndInfoId(businessModuleId, taskId);
               IModelBusinessDataDAL dal = this.GetDAL<IModelBusinessDataDAL>(sc);
               var model = dal.Load(businessModuleId, taskId, sc);
               var result = dal.Delete(businessModuleId, taskId, sc);
               if (result)
               {
                   //缓存一些关键信息，方便后续操作
                   var tempKeys = new
                   {
                       Id = GetValue(model, BaseField.Id),
                       AppCode = GetValue(model, BaseField.AppCode),
                       BusinessModuleId = GetValue(model, BaseField.BusinessModuleId),
                       SceneCode = GetValue(model, BaseField.SceneCode)
                   };
                   //【接入】-【基础协作】-删除
                   CooperationExchanger.RemoveCooperation(sc, taskId);
               }
               return result;
           };
            return this.CallFuncForContextInfo<bool>(func, sc, "DeleteInformation", "删除登记单失败");
        }

        /// <summary>
        /// 修改登记单多个属性（只允许属性调用）
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="infoId">任务ID</param>
        /// <param name="modifedJson">需要修改的属性的JSON {key:value}</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public string SingleModified(string businessModuleId, string sceneCode, string infoId, string modifedJson, IServerContext sc)
        {
            Func<ServerContextInfo, string> func = (info) =>
            {
                ValidBsinnessModuleIdAndInfoId(businessModuleId, infoId);
                if (string.IsNullOrEmpty(modifedJson)) ThrowArgException("modifedJson不能为空");
                BsonDocument modifed = BsonDocument.Parse(modifedJson);
                BsonDocument serverModel = BaseLoadInformation(businessModuleId, infoId, sc);
                //缓存一些关键信息，方便后续操作
                var tempKeys = new
                {
                    Id = GetValue(serverModel, BaseField.Id),
                    AppCode = GetValue(serverModel, BaseField.AppCode),
                    BusinessModuleId = GetValue(serverModel, BaseField.BusinessModuleId),
                    SceneCode = GetValue(serverModel, BaseField.SceneCode),
                };

                List<string> clientFields = new List<string>();
                foreach (var item in modifed)
                {
                    clientFields.Add(item.Name);
                }
                var sceneOrgId = GetValue(serverModel, BaseField.OrganizationId);
                var noConfigFields = CheckHasProperty(tempKeys.AppCode, businessModuleId, sceneCode, sceneOrgId, clientFields, sc);
                var msg = "";
                foreach (var item in noConfigFields)
                {
                    msg += item + "、";
                }
                if (!string.IsNullOrEmpty(msg))
                {
                    ThrowArgException("【" + msg + "】字段不存在");
                }
                return IsNull2Empety(BaseSingleModified(businessModuleId, sceneCode, infoId, modifedJson, sc));
            };
            return this.CallFuncForContextInfo<string>(func, sc, "SingleModified", "修改登记单属性失败");
        }


        #endregion

        #region 查询
        /// <summary>
        /// 获取登记单
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="taskId">任务ID</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public string LoadInformation(string businessModuleId, string taskId, IServerContext sc)
        {
            Func<ServerContextInfo, string> func = (info) =>
            {
                BsonDocument result = BaseLoadInformation(businessModuleId, taskId, sc);
                return IsNull2Empety(result);
            };
            return this.CallFuncForContextInfo<string>(func, sc, "LoadInformation", "获取登记单失败");
        }

        /// <summary>
        /// 获取列表数据
        /// </summary>
        /// <param name="searchModel"></param>
        /// <param name="isbyuser">是否根据用户过滤 0标识是，1表示否</param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public string Getlist(SearchModel searchModel,int isbyuser, IServerContext sc)
        {
            Func<ServerContextInfo, string> func = (info) =>
            {
                searchModel.UserId = info.UserId;
                searchModel.OrganizationId = info.OrgId;

                //检查参数
                if (string.IsNullOrEmpty(searchModel.AppCode)) ThrowArgException("AppCode不能为空");
                if (string.IsNullOrEmpty(searchModel.BusinessModuleId)) ThrowArgException("AppCode不能为空");
                if (string.IsNullOrEmpty(searchModel.SceneCode)) ThrowArgException("AppCode不能为空");
                if (searchModel.ListType > 5 || searchModel.ListType < 0) ThrowArgException("ListType的值是无效的");

                //检查过滤字段
                if (searchModel.Filter != null)
                {
                    var serachFields = (from m in searchModel.Filter select m.Field).ToList();
                    CheckListFieldsForSearch(searchModel.AppCode, searchModel.BusinessModuleId, searchModel.SceneCode, searchModel.SceneOrgId, serachFields, sc);
                }
                //检查排序字段
                if (searchModel.Sorts != null)
                {
                    var sortFields = (from m in searchModel.Sorts select m.Field).ToList();
                    CheckListFieldsForSort(searchModel.AppCode, searchModel.BusinessModuleId, searchModel.SceneCode, searchModel.SceneOrgId, sortFields, sc);
                }
                //检查分页参数
                if (searchModel.StartIndex < 0) ThrowArgException("StartIndex的值是无效的");
                if (searchModel.Length <= 0) ThrowArgException("Length的值是无效的");

                var dal = this.GetDAL<IModelBusinessDataDAL>(sc);
                var list = dal.GetTaskList(searchModel, isbyuser, sc);
                BsonDocument doc = new BsonDocument();
                BsonArray arr = new BsonArray();
                foreach (var item in list)
                {
                    arr.Add(item);
                }
                doc.SetElement(new BsonElement("List", arr));
                return IsNull2Empety(doc);
            };
            return this.CallFuncForContextInfo<string>(func, sc, "LoadTask", "获取任务失败");
        }

        #endregion

        #endregion

        #region 成员相关

        #region 增加

        /// <summary>
        /// 添加成员
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="taskId"></param>
        /// <param name="memberJSON"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public bool AddMember(string businessModuleId, string sceneCode, string taskId, string memberJSON, IServerContext sc)
        {
            return this.AddMembers(businessModuleId, sceneCode, taskId, new BsonArray() { BsonDocument.Parse(memberJSON) }.ToJson(), sc);
        }

        /// <summary>
        /// 批量添加成员
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="taskId"></param>
        /// <param name="membersJSON"></param>
        /// <param name="sc"></param>
        public bool AddMembers(string businessModuleId, string sceneCode, string taskId, string membersJSON, IServerContext sc)
        {
            Func<ServerContextInfo, bool> func = (info) =>
            {
                BsonArray clicetMembers = BsonDocument.Parse(membersJSON).GetElement(BaseField.Members).Value.AsBsonArray;
                IModelBusinessDataDAL dal = this.GetDAL<IModelBusinessDataDAL>(sc);
                BsonDocument serverTaskModel = BaseLoadInformation(businessModuleId, taskId, sc);

                string appCode = GetValue(serverTaskModel, BaseField.AppCode);

                BsonArray members = new BsonArray();

                //mod by wjs 2017-05-19 添加过滤重复人 begin
                //标记是否是因为重复过滤导致的添加人数量为0
                int filterCount = 0;
                if (clicetMembers.Count > 0)
                {

                    var serverMemebers = serverTaskModel.GetElement(BaseField.Members).Value.AsBsonArray;
                    var serverUserIds = new List<string>();
                    foreach (var item in serverMemebers)
                    {
                        serverUserIds.Add(GetValue(item.AsBsonDocument, BaseMemberField.UserId));
                    }

                    foreach (var m in clicetMembers)
                    {
                        if (!serverUserIds.Contains(GetValue(m.AsBsonDocument, BaseMemberField.UserId)))
                        {
                            members.Add(m);
                        }
                        else
                        {
                            filterCount++;
                        }
                    }
                }
                if (members.Count == 0)
                {
                    //当没有需要添加的成员是，只有当过滤掉的人数和参数传入的人数一致时，才认为是正常的。
                    return filterCount == clicetMembers.Count;
                }

                //mod by wjs 2017-05-19 添加过滤重复人 end

                var saveMembers = new BsonArray();
                foreach (var item in members)
                {
                    var member = item.AsBsonDocument;
                    if (GetValueByInt(member, BaseMemberField.MemberType) != (int)MemberType.Administrator)
                    {
                        saveMembers.Add(CreateMember(GetValue(member, BaseMemberField.UserId),
                              GetValue(member, BaseMemberField.OrganizationId),
                              GetValue(member, BaseMemberField.UserFaceId),
                              (int)MemberType.Participator,
                              sc
                              ));
                    }
                }

                //保存数据
                var result = dal.AddMembers(businessModuleId, taskId, saveMembers, sc);
                return result;
            };
            return this.CallFuncForContextInfo<bool>(func, sc, "AddMembers", "新增成员失败");
        }


        #region 删除
        /// <summary>
        /// 删除成员
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="infoId"></param>
        /// <param name="userId"></param>
        /// <param name="organizationId"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public bool RemoveMember(string businessModuleId, string sceneCode, string infoId, string userId, string organizationId, IServerContext sc)
        {
            BsonArray arr = new BsonArray();
            BsonDocument doc = new BsonDocument();
            doc.SetElement(new BsonElement(BaseMemberField.UserId, userId));
            doc.SetElement(new BsonElement(BaseMemberField.OrganizationId, organizationId));
            arr.Add(doc);
            return RemoveMembers(businessModuleId, sceneCode, infoId, arr.ToJson(), sc);
        }
        /// <summary>
        /// 批量删除成员
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="infoId"></param>
        /// <param name="membersJSON"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public bool RemoveMembers(string businessModuleId, string sceneCode, string infoId, string membersJSON, IServerContext sc)
        {
            Func<ServerContextInfo, bool> func = (info) =>
            {
                BsonArray members = BsonDocument.Parse(membersJSON).GetElement(BaseField.Members).Value.AsBsonArray;
                IModelBusinessDataDAL dal = this.GetDAL<IModelBusinessDataDAL>(sc);
                BsonDocument serverTaskModel = BaseLoadInformation(businessModuleId, infoId, sc);
                string appCode = GetValue(serverTaskModel, BaseField.AppCode);

                //缓存一些关键信息，方便后续操作
                var tempKeys = new
                {
                    Id = GetValue(serverTaskModel, BaseField.Id),
                    AppCode = GetValue(serverTaskModel, BaseField.AppCode),
                    BusinessModuleId = GetValue(serverTaskModel, BaseField.BusinessModuleId),
                    SceneCode = GetValue(serverTaskModel, BaseField.SceneCode)
                };
                //基础协作成员
                Dictionary<string, string> removeMembers = new Dictionary<string, string>();
                foreach (var item in members)
                {
                    var member = item.AsBsonDocument;
                    removeMembers.Add(GetValue(member, BaseMemberField.UserId), GetValue(member, BaseMemberField.OrganizationId));
                }

                //保存数据
                bool result = dal.RemoveMembers(businessModuleId, infoId, removeMembers, sc);

                return result;
            };
            return this.CallFuncForContextInfo<bool>(func, sc, "AddMembers", "新增成员失败");
        }
        #endregion

        #endregion

        #endregion

        #region 私有方法

        #region 基础
        /// <summary>
        /// 获取一条数据
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="taskId"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        protected BsonDocument BaseLoadInformation(string businessModuleId, string taskId, IServerContext sc)
        {
            //验证参数有效性
            ValidBsinnessModuleIdAndInfoId(businessModuleId, taskId);

            IModelBusinessDataDAL dal = this.GetDAL<IModelBusinessDataDAL>(sc);
            var result = dal.Load(businessModuleId, taskId, sc);
            if (result == null) ThrowArgException(string.Format("不存在ID为{0}的登记单", taskId));
            return result;
        }


        /// <summary>
        /// 修改单个字段
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="infoId">登记单ID</param>
        /// <param name="modifedJson">需要修改的属性的JSON {key:value}</param>
        /// <param name="sc">上下文</param>
        protected BsonDocument BaseSingleModified(string businessModuleId, string sceneCode, string infoId, string modifedJson, IServerContext sc)
        {
            Func<ServerContextInfo, BsonDocument> func = (info) =>
            {
                ValidBsinnessModuleIdAndInfoId(businessModuleId, infoId);
                BsonDocument modifed = BsonDocument.Parse(modifedJson);
                BsonDocument serverModel = this.BaseLoadInformation(businessModuleId, infoId, sc);
                foreach (var item in modifed.Elements)
                {
                    serverModel.SetElement(item);
                }
                return BaseUpdateInformation(businessModuleId, sceneCode, serverModel.ToJson(), sc);
            };
            return this.CallFuncForContextInfo<BsonDocument>(func, sc, "BaseSingleModified", "修改业务模块下的一条登记单的一个或多个属性失败");
        }

        /// <summary>
        /// 新增\修改模块下的一条记录
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <param name="entity">实体</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        protected BsonDocument BaseSaveBusiness(string businessModuleId, string sceneCode, string sceneOrgId, BsonDocument entity, IServerContext sc)
        {
            Func<ServerContextInfo, BsonDocument> func = (info) =>
             {
                 #region 数据验证
                 if (entity == null) ThrowErrorCodeException("数据对象为空");
                 //缓存一些关键信息，方便后续操作
                 var tempKeys = new
                 {
                     Id = GetValue(entity, BaseField.Id),
                     AppCode = GetValue(entity, BaseField.AppCode),
                     BusinessModuleId = GetValue(entity, BaseField.BusinessModuleId),
                     SceneCode = GetValue(entity, BaseField.SceneCode)
                 };
                 CheckDocument(tempKeys.AppCode, businessModuleId, tempKeys.SceneCode, sceneOrgId, entity, sc);
                 #endregion

                 IModelBusinessDataDAL dal = this.GetDAL<IModelBusinessDataDAL>(sc);
                 //保存数据
                 var result = dal.Save(businessModuleId, entity, sc);

                 //返回数据
                 return result;
             };
            return this.CallFuncForContextInfo<BsonDocument>(func, sc, "SaveBusiness", "保存数据");
        }


        /// <summary>
        /// 添加任务
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="entity">业务实体</param>
        /// <param name="sc">上下文信息</param>
        /// <param name="initFunc">初始化业务实体接口（用于新增并发布）</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <returns></returns>
        protected BsonDocument BaseAddInformation(string businessModuleId, string sceneCode, string entity, IServerContext sc, Func<BsonDocument, BsonDocument> initFunc = null, string sceneOrgId = "")
        {
            Func<ServerContextInfo, BsonDocument> func = (info) =>
            {
                BsonDocument model = BsonDocument.Parse(entity);

                string[] requireField = new string[] {
                    BaseField.AppCode,
                    BaseField.SceneCode,
                    BaseField.CreateUserFaceId
                };
                #region 检查必填
                ValidBsinnessModuleIdAndEntity(businessModuleId, entity);
                ValidClientModelRequireField(model, requireField);
                #endregion

                #region 初始化值
                model.SetElement(new BsonElement(BaseField.BusinessModuleId, businessModuleId));
                model.SetElement(new BsonElement(BaseField.CreateTime, DateTime.Now));
                model.SetElement(new BsonElement(BaseField.CreateUserId, info.UserId));
                model.SetElement(new BsonElement(BaseField.OrganizationId, info.OrgId));

                #region 调用-【基础协作】-【新增】
                var baseCoopTask = CooperationExchanger.AddCooperation(sc,
                GetValue(model, BaseField.OrganizationId),
                //GetValue(model, BaseField.Title),
#warning 如何确定标题，暂时先给一个假的
                "登记单标题",

                    GetValue(model, BaseField.AppCode),
                    GetValue(model, BaseField.SceneCode),
                    businessModuleId
                    );
                if (baseCoopTask == null) ThrowErrorCodeException("调用基础协作创建登记单失败");
                model.SetElement(new BsonElement(BaseField.Id, baseCoopTask.cid));
                model.SetElement(new BsonElement(BaseField.ResoucePoolId, baseCoopTask.resourceid));
                #endregion

                if (initFunc != null)
                {
                    model = initFunc(model);
                }

                //缓存一些关键信息，方便后续操作
                var tempKeys = new
                {
                    Id = GetValue(model, BaseField.Id),
                    AppCode = GetValue(model, BaseField.AppCode),
                    BusinessModuleId = GetValue(model, BaseField.BusinessModuleId),
                    SceneCode = GetValue(model, BaseField.SceneCode)
                };

                var noAdminMembers = InitMemberForAdd(tempKeys.AppCode, businessModuleId, tempKeys.SceneCode, model, sc);
                if (string.IsNullOrEmpty(sceneOrgId))
                {
                    sceneOrgId = GetValue(model, BaseField.OrganizationId);
                }
                #region 调用-【通用资源】-【新增】
                GetResourceByClientModel(tempKeys.AppCode, businessModuleId, tempKeys.SceneCode, sceneOrgId, model, sc);
                #endregion

                #endregion

                var validUsers = new Dictionary<string, string>();

                try
                {
                    var result = BaseSaveBusiness(businessModuleId, tempKeys.SceneCode, sceneOrgId, model, sc);


                    #region 调用-【成员】-【新增】
                    AddMembers(businessModuleId, tempKeys.SceneCode, tempKeys.Id, new BsonDocument(new BsonElement(BaseField.Members, noAdminMembers)).ToJson(), sc);

                    #endregion

                    return result;
                }
                catch (Exception ex)
                {
                    //调用-【业务数据】-【删除】
                    this.DeleteInformation(tempKeys.BusinessModuleId, tempKeys.SceneCode, tempKeys.Id, sc);
                    throw ex;
                }

            };
            return this.CallFuncForContextInfo<BsonDocument>(func, sc, "AddInformation", "添加登记单失败");
        }


        /// <summary>
        /// 修改登记单
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="entity">业务实体</param>
        /// <param name="sc">上下文</param>
        /// <param name="setEntityFunc">修改业务实体接口,在保存字段检查前执行替换（用于修改并发布）</param>
        /// <param name="canUpdateBase">可以修改内置字段</param>
        /// <returns></returns>
        protected BsonDocument BaseUpdateInformation(string businessModuleId, string sceneCode, string entity, IServerContext sc, Func<BsonDocument, BsonDocument> setEntityFunc = null, bool canUpdateBase = true)
        {
            Func<ServerContextInfo, BsonDocument> func = (info) =>
           {
               BsonDocument clientModel = BsonDocument.Parse(entity);
               string[] requireField = new string[] {
                     BaseField.AppCode,
                     BaseField.Id,
                     BaseField.SceneCode
                };
               #region 检查必填
               ValidBsinnessModuleIdAndEntity(businessModuleId, entity);
               ValidClientModelRequireField(clientModel, requireField);
               #endregion

               //先从数据库取
               var id = clientModel[BaseField.Id].AsString;
               var appCode = clientModel[BaseField.AppCode].AsString;
               var serverModel = this.BaseLoadInformation(businessModuleId, id, sc);
               //执行回调替换
               if (setEntityFunc != null)
               {
                   clientModel = setEntityFunc(clientModel);
               }
               //根据配置，用客户端的值替换给需要需要保存的实体
               //记住修改的字段
               var changeFields = new Dictionary<string, string>();
               var sceneOrgId = GetValue(serverModel, BaseField.OrganizationId);
               var fields = this.GetFieldConfig(appCode, businessModuleId, sceneCode, sceneOrgId, sc);

               List<string> fieldTypes = new List<string>();
               foreach (var fd in fields)
               {
                   fieldTypes.Add(fd.ControlType);
               }
               List<string> resouceTypes = GetResouceControlsCode(sc, fieldTypes);

               foreach (var item in fields)
               {
                   var tempClientElement = GetElement(clientModel, item.FieldCode);
                   if (tempClientElement.Name == null)
                   {
                       continue;
                   }
                   if (GetElement(serverModel, item.FieldCode).Value != tempClientElement.Value)
                   {
                       serverModel[item.FieldCode] = clientModel[item.FieldCode];
                       if (!resouceTypes.Contains(item.ControlType))
                       {
                           changeFields.Add(item.FieldCode, item.FieldName);
                       }
                   }
               }

               if (canUpdateBase)
               {
                   var baseFields = this.GetBaseFieldConfig(sc);
                   foreach (var item in baseFields)
                   {
                       var tempClientElement = GetElement(clientModel, item.FieldCode);
                       if (tempClientElement.Name == null)
                       {
                           continue;
                       }
                       if (GetElement(serverModel, item.FieldCode).Value != tempClientElement.Value)
                       {
                           serverModel[item.FieldCode] = clientModel[item.FieldCode];
                       }
                   }

               }

               //缓存一些关键信息，方便后续操作
               var tempKeys = new
               {
                   Id = GetValue(serverModel, BaseField.Id),
                   AppCode = GetValue(serverModel, BaseField.AppCode),
                   BusinessModuleId = GetValue(serverModel, BaseField.BusinessModuleId),
                   SceneCode = GetValue(serverModel, BaseField.SceneCode)
               };
               try
               {
                   //保存
                   var updateRsult = this.BaseSaveBusiness(businessModuleId, tempKeys.SceneCode, sceneOrgId, serverModel, sc);

                   if (changeFields.Keys.Contains(BaseField.Title))
                   {
                       //调用-【基础协作】-修改
                       CooperationExchanger.UpdateCooperationName(sc, GetValue(serverModel, BaseField.Id), GetValue(serverModel, BaseField.Title));
                   }

                   return updateRsult;
               }
               catch (Exception ex)
               {
                   //修改暂时无法回退
                   throw ex;
               }
           };
            return this.CallFuncForContextInfo<BsonDocument>(func, sc, "BaseUpdateInformation", "修改登记单失败");
        }

        /// <summary>
        /// 新增时初始化成员
        /// </summary>
        /// <param name="appCode">应用编码</param>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="source">数据实体</param>
        /// <param name="sc">上下文信息</param>
        protected BsonArray InitMemberForAdd(string appCode, string businessModuleId, string sceneCode, BsonDocument source, IServerContext sc)
        {
            Func<ServerContextInfo, BsonArray> func = (info) =>
             {

                 //如果没有成员，则先添加成员节点
                 //如果有成员 则添加管理员，并修改成员属性
                 var memberElement = GetElement(source, BaseField.Members);
                 if (string.IsNullOrEmpty(memberElement.Name))
                 {
                     memberElement = new BsonElement(BaseField.Members, new BsonArray());
                     source.SetElement(memberElement);
                 }
                 var memberList = memberElement.Value.AsBsonArray;
                 //初始化客户端传递的成员

                 BsonDocument clientDoc;
                 BsonArray serverList = new BsonArray();
                 BsonArray resultList = new BsonArray();
                 //添加管理员
                 var userInfo = PostExchanger.GetUserInfo(info.UserId, info.OrgId, sc);
                 if (userInfo == null)
                 {
                     ThrowArgException(string.Format("调用平台接口获取用户信息失败！用户ID：{2}组织ID：{1}", info.UserId, info.OrgId));
                 }
                 //serverList.Add(CreateMember(info.UserId, info.OrgId, userInfo.face, (int)MemberType.Administrator, sc));

                 string[] requireField = new string[] {
                           BaseMemberField.UserId,
                           BaseMemberField.OrganizationId,
                           BaseMemberField.UserFaceId,
                        };
                 foreach (var item in memberList)
                 {
                     clientDoc = item.AsBsonDocument;
                     ValidClientModelRequireField(clientDoc, requireField);
                     resultList.Add(CreateMember(clientDoc.GetValue(BaseMemberField.UserId).AsString,
                         clientDoc.GetValue(BaseMemberField.OrganizationId).AsString,
                         clientDoc.GetValue(BaseMemberField.UserFaceId).AsString,
                         (int)MemberType.Participator,
                         sc
                         ));
                 }

                 source.SetElement(new BsonElement(BaseField.Members, serverList));
                 return resultList;
             };
            return this.CallFuncForContextInfo(func, sc, "InitMemberForAdd", "新增登记单初始化成员失败");
        }


        #endregion

        #region 其他


        #region 验证

        /// <summary>
        /// 检查业务模块ID和任务ID
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="taskId"></param>
        private void ValidBsinnessModuleIdAndInfoId(string businessModuleId, string taskId)
        {
            if (string.IsNullOrEmpty(businessModuleId))
            {
                ThrowArgException(string.Format("参数{0}不能为空", "businessModuleId"));
            }
            if (string.IsNullOrEmpty(taskId))
            {
                ThrowArgException(string.Format("参数{0}不能为空", "businessModuleId"));
            }
        }
        /// <summary>
        /// 检查业务模块ID和实体
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="entity"></param>
        private void ValidBsinnessModuleIdAndEntity(string businessModuleId, string entity)
        {
            if (string.IsNullOrEmpty(businessModuleId))
            {
                ThrowArgException(string.Format("参数{0}不能为空", "businessModuleId"));
            }
            if (string.IsNullOrEmpty(entity))
            {
                ThrowArgException(string.Format("参数{0}不能为空", "entity"));
            }
        }

        /// <summary>
        /// 检查客户端model的必填字段
        /// </summary>
        /// <param name="model"></param>
        /// <param name="fields"></param>
        /// <returns></returns>
        private void ValidClientModelRequireField(BsonDocument model, string[] fields)
        {
            StringBuilder msg = new StringBuilder();
            foreach (var item in fields)
            {
                if (string.IsNullOrEmpty(GetElement(model, item).Name))
                {
                    msg.AppendLine(string.Format("字段{0}是必须的", item));
                }
            }
            var result = msg.ToString();
            if (!string.IsNullOrEmpty(result))
            {
                ThrowArgException(result);
            }
        }

        /// <summary>
        /// 检查文档（对扩展字段验证了规则，对内置字段只验证了是否存在）
        /// </summary>
        /// <param name="appCode">应用编码</param>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <param name="document">需要检查的文档</param>
        /// <param name="sc">上下文信息</param>
        /// <returns></returns>
        private void CheckDocument(string appCode, string businessModuleId, string sceneCode, string sceneOrgId, BsonDocument document, IServerContext sc)
        {
            Action func = () =>
             {
                 StringBuilder strMsg = new StringBuilder();
                 List<FieldVerify> baseFields = GetBaseFieldConfig(sc);

                 List<FieldVerify> fields = GetFieldConfig(appCode, businessModuleId, sceneCode, sceneOrgId, sc);
                 List<ModelPropertyConfig> propertys = GetPropertys(appCode, businessModuleId, sceneCode, sceneOrgId, sc);
                 ModelPropertyConfig tempProperty = null;
                 foreach (var item in document)
                 {
                     FieldVerify field = fields.FirstOrDefault<FieldVerify>(m => m.FieldCode.ToLower().Equals(item.Name.ToLower()));
                     if (field != null)
                     {
                         var result = field.Verifiable.Verify(item.Value);
                         if (result.ErrorCode != "0")
                         {
                             strMsg.AppendLine(result.Message);
                         }
                     }
                     else
                     {
                         if ((field = baseFields.FirstOrDefault<FieldVerify>(m => m.FieldCode.ToLower().Equals(item.Name.ToLower()))) == null)
                         {
                             //如果在Base字段中也找不到，那说明此字段不存在
#warning 暂时为了兼容模块属性修改后产生的无效字段，暂时不做处理，后续设计时发布模块数据后动态修改Mongodb集合文档结构后再开启。
                             //strMsg.AppendLine(string.Format("不存在字段：{0}", item.Name));
                         }
                         //property中检查
                         else if (field == null && (tempProperty = propertys.FirstOrDefault<ModelPropertyConfig>(m => m.FieldCode.ToLower().Equals(item.Name.ToLower()))) == null)
                         {
                             strMsg.AppendLine(string.Format("不存在字段：{0}", item.Name));
                         }
                     }
                 }
                 var resultMsg = strMsg.ToString();
                 if (!string.IsNullOrEmpty(resultMsg))
                 {
                     ThrowArgException(resultMsg);
                 }
             };
            this.CallAction(func, sc, "CheckDocument", "检查数据时失败");
        }

        #endregion

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
            return int.Parse(element.Value.ToString());
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

        #region 资源文件相关
        /// <summary>
        /// 获取客户端POST数据中的附件相关信息
        /// </summary>
        /// <param name="appCode">应用编码</param>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="sceneOrgId">场景组织机构ID</param>
        /// <param name="model"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        private void GetResourceByClientModel(string appCode, string businessModuleId, string sceneCode, string sceneOrgId, BsonDocument model, IServerContext sc)
        {
            //先取到所有设计时配置字段
            var modelInfo = BsonDocument.Parse(GetModuleInfo(appCode, businessModuleId, sceneCode, sceneOrgId, sc));
            var formConfig = modelInfo[BaseConfigField.FormConfig];
            var fields = formConfig[BaseConfigField.FormFields].AsBsonArray;
            List<ResourceFolderAddModel> folders = new List<ResourceFolderAddModel>();

            List<string> fieldTypes = new List<string>();
            foreach (var item in fields)
            {
                fieldTypes.Add(item[BaseConfigField.ControlType].AsString);
            }
            List<ControlEntity> resouceTypes = GetResouceControls(sc, fieldTypes);
            //控件缓存，用于后续判断存储方式
            Dictionary<string, ControlEntity> controlTemp = new Dictionary<string, ControlEntity>();
            foreach (var field in fields)
            {
                //如果是资源类控件
                //if (IsResouceControl(field[BaseConfigField.ControlType].AsString, sc))
                //{
                var control = resouceTypes.FirstOrDefault(m => m.Code == field[BaseConfigField.ControlType].AsString);
                if (control != null)
                {
                    //获取数据
                    var fileCode = GetValue(field.AsBsonDocument, BaseConfigField.FieldCode);
                    var value = GetElement(model, fileCode).Value.ToString();
                    if (!string.IsNullOrEmpty(value))
                    {
                        var floder = Newtonsoft.Json.JsonConvert.DeserializeObject<ResourceFolderAddModel>(GetElement(model, fileCode).Value.ToJson());
                        floder.name = fileCode;
                        folders.Add(floder);
                    }
                    if (!controlTemp.Keys.Contains(fileCode))
                    {
                        controlTemp.Add(fileCode, control);
                    }
                }
            }
            ResourceFolderAddModel root = new ResourceFolderAddModel()
            {
                name = "root",
                description = "root",
                folders = folders,
                resources = new List<ResourceAddModel>(),
                parentfolderid = "",
                partitiontype = "0",
                savetype = "child",
                rpid = ""
            };

            if (root != null)
            {
                root.rpid = GetValue(model, BaseField.ResoucePoolId);
                List<ResourceFolderModel> list_file = ResourceExchanger.ImportFolder(root, sc);
                if (list_file == null) throw new Exception("批量添加文件夹、文件返回值为NULL");

                //保存到实体中
                SaveResouceField(model, controlTemp, list_file);

            }
        }

        private BsonDocument SaveResouceField(BsonDocument model, Dictionary<string, ControlEntity> controlTemp, List<ResourceFolderModel> list_file)
        {
            foreach (var item in list_file)
            {
                //先取到名称对于的控件类型
                if (controlTemp.Keys.Contains(item.name))
                {
                    if (string.IsNullOrEmpty(controlTemp[item.name].ExtendConfig))
                    {
                        //只保存目录ID
                        model.SetElement(new BsonElement(item.name, item.id));
                    }
                    else
                    {
                        BsonDocument extendConfig = BsonDocument.Parse(controlTemp[item.name].ExtendConfig);
                        int saveType = GetValueByInt(extendConfig, ControlExtendField.SaveMode);
                        BsonArray fids = new BsonArray();
                        BsonArray rids = new BsonArray();
                        switch (saveType)
                        {
                            case (int)ResouceControlSaveMode.OnlySaveFile:
                                //只保存文件ID
                                foreach (var fid in item.resourcemodels)
                                {
                                    fids.Add(fid.expid);
                                }
                                model.SetElement(new BsonElement(item.name, fids));
                                break;
                            case (int)ResouceControlSaveMode.All:
                                //都保存
                                BsonDocument doc = new BsonDocument();
                                doc.SetElement(new BsonElement("FloderId", item.id));
                                foreach (var fid in item.resourcemodels)
                                {
                                    fids.Add(fid.expid);
                                    rids.Add(fid.rid);
                                }
                                doc.SetElement(new BsonElement("FileIds", fids));
                                doc.SetElement(new BsonElement("RIds", rids));

                                model.SetElement(new BsonElement(item.name, doc.ToJson()));
                                break;
                            case (int)ResouceControlSaveMode.Default:
                            default:
                                //只保存目录ID
                                model.SetElement(new BsonElement(item.name, item.id));
                                break;
                        }
                    }
                }
            }
            return model;
        }

        #endregion

        #region 成员辅助
        /// <summary>
        /// 创建一个成员元素
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="organizationId"></param>
        /// <param name="userFaceId"></param>
        /// <param name="memberType"></param>
        /// <param name="isValid"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        private BsonDocument CreateMember(string userId, string organizationId, string userFaceId, int memberType, IServerContext sc)
        {
            Func<ServerContextInfo, BsonDocument> func = (info) =>
          {
              if (string.IsNullOrEmpty(userId)) ThrowArgException("UserId的值为空");
              //if (string.IsNullOrEmpty(organizationId)) ThrowArgException("OrganizationId的值为空");
              if (userFaceId == null)
              {
                  userFaceId = "";
              }
              BsonDocument member = new BsonDocument();
              member.Add(new BsonElement(BaseMemberField.UserId, userId));
              member.Add(new BsonElement(BaseMemberField.OrganizationId, organizationId));
              member.Add(new BsonElement(BaseMemberField.UserFaceId, userFaceId));
              member.Add(new BsonElement(BaseMemberField.MemberType, memberType));
              member.Add(new BsonElement(BaseMemberField.JoinTime, DateTime.Now));
              return member;
          };
            return this.CallFuncForContextInfo<BsonDocument>(func, sc, "CreateMember", "创建一个成员元素失败");

        }
        #endregion

        #region 类型转换.
        private ModelFieldConfig UserField2ModleField(ModelUserExtendFieldConfig userField)
        {
            return new ModelFieldConfig()
            {
                FieldCode = userField.FieldCode,
                FieldName = userField.FieldName,
                ControlConfig = userField.ControlConfig,
                ControlType = userField.ControlType,
                IsHiddenField = false,
                IsDefaultField = false,
            };
        }
        private ModelListFieldConfig UserField2ModleListField(ModelUserExtendFieldConfig userField)
        {
            return new ModelListFieldConfig()
            {
                FieldCode = userField.FieldCode,
                FieldName = userField.FieldName,
                //IsSupportSearch = userField.IsSupportSearch,
                //IsSupportSort = userField.IsSupportSort,
                //Width = userField.Width,
            };
        }
        #endregion

        #endregion

        #endregion
    }
}
