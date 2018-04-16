using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.CompilerServices;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Components;
using LeadingCloud.MISPT.InformationRegistModel.Common;
using LeadingCloud.MISPT.Framework.Common.Components;
using LeadingCloud.MISPT.Framework.ModuleBase;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Interfaces;


/*********************************************************
 * 创建者：lz-wjs
 * 创建日期：2017/3/1 11:21:49
 * 机器名称：WJS
 * 描述：信息登记模型模块运行时用户自定义字段管理类
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime
{
    /// <summary>
    /// 信息登记模型模块运行时用户自定义字段管理类
    /// </summary>
    public class ModelUserDefinedFieldManager : ModuleManager
    {
        #region 构造函数、单例
        /// <summary>
        /// 构造方法
        /// </summary>
        private ModelUserDefinedFieldManager()
        {
        }

        /// <summary>
        /// Manager实例
        /// </summary>
        public static ModelUserDefinedFieldManager Instance { private set; get; }
        /// <summary>
        /// 静态构造方法
        /// </summary>
        [MethodImpl(MethodImplOptions.Synchronized)]
        static ModelUserDefinedFieldManager()
        {
            //      静态实例，只初始化一次
            if (Instance == null) Instance = new ModelUserDefinedFieldManager();
        }
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
        #endregion

        #region 配置信息
        /// <summary>
        /// 获取模块配置信息（按企业进行分类，同一个企业的同一个协作模型模块[modelId]共用一套）
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="sceneCode"></param>
        /// <param name="sceneOrgId"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public List<ModelUserExtendFieldConfig> GetModulUserFields(string businessModuleId, string sceneCode, string sceneOrgId, IServerContext sc)
        {
            Func<ServerContextInfo, List<ModelUserExtendFieldConfig>> func = (info) =>
          {
              if (string.IsNullOrEmpty(businessModuleId)) ThrowErrorCodeException("业务模块id为空");
              if (string.IsNullOrEmpty(sceneCode)) ThrowErrorCodeException("场景id为空");
              if (string.IsNullOrEmpty(sceneOrgId)) ThrowErrorCodeException("组织场景id为空");
              IModelUserExtendConfigDAL dal = this.GetDAL<IModelUserExtendConfigDAL>(sc);
              List<ModelUserExtendFieldConfig> list = dal.GetModulUserFields(businessModuleId, sceneCode, sceneOrgId, sc).ToList();
              return list;
          };
            return this.CallFuncForContextInfo<List<ModelUserExtendFieldConfig>>(func, sc, "GetModulUserFields", "获取用户扩展字段");
        }


        #endregion

        #region 保存用户扩展配置信息
        /// <summary>
        /// 【运行时】保存用户扩展配置数据
        /// </summary>
        /// <param name="data"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public ModelUserExtendConfig SaveUserExtendData(ModelUserExtendConfig data, IServerContext sc)
        {
            Func<ModelUserExtendConfig> func = () =>
           {
               //          1.1 数据验证
               if (data == null) ThrowErrorCodeException("数据对象为空");
               if (String.IsNullOrEmpty(data.Id)) data.Id = Guid.NewGuid().ToString();
               ServerContextInfo scInfo = GetServerContextInfo(sc);
               //String id = data.Id;
               IModelUserExtendConfigDAL dal = this.GetDAL<IModelUserExtendConfigDAL>(sc);
               //ModelUserExtendConfig oldData = dal.LoadData(id, sc);
               data = dal.SaveData(data, sc);
               return data;
           };
            return this.CallFunc<ModelUserExtendConfig>(func, sc, "SaveUserExtendData", "【运行时】保存用户扩展配置数据");
        }
        #endregion

        #region 获取单一用户扩展配置对象
        /// <summary>
        /// 【运行时】根据业务模块id获取用户扩展配置
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="sceneCode"></param>
        /// <param name="sceneOrgId">组织场景Id</param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public ModelUserExtendConfig GetData(string businessModuleId, string sceneCode, string sceneOrgId, IServerContext sc)
        {
            Func<ModelUserExtendConfig> func = () =>
            {
                if (string.IsNullOrEmpty(businessModuleId)) ThrowErrorCodeException("业务模块id为空");
                if (string.IsNullOrEmpty(sceneCode)) ThrowErrorCodeException("场景id为空");
                if (string.IsNullOrEmpty(sceneOrgId)) ThrowErrorCodeException("组织场景id为空");
                IModelUserExtendConfigDAL dal = this.GetDAL<IModelUserExtendConfigDAL>(sc);
                ModelUserExtendConfig data = dal.GetData(businessModuleId, sceneCode, sceneOrgId, sc);
                return data;
            };
            return this.CallFunc<ModelUserExtendConfig>(func, sc, "GetData", "【运行时】获取用户扩展配置数据");
        }
        #endregion
    }
}
