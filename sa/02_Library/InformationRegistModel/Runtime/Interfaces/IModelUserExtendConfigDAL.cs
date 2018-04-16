using LeadingCloud.Framework;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Components;
using LeadingCloud.MISPT.Framework.Database.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

/*********************************************************
 * 创建者：lz-ljp
 * 创建日期：2017年4月6日10:59:10
 * 机器名称：ljpw10
 * 描述：【信息登记模型】运行时,用户扩展配置数据数据库访问程序接口
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Interfaces
{
    /// <summary>
    /// 【信息登记模型】运行时,用户扩展配置接口类
    /// </summary>
    public interface IModelUserExtendConfigDAL : IDbModelDAL<ModelUserExtendConfig>
    {
        /// <summary>
        /// 【运行时】获取用户扩展配置属性列表
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="sceneCode"></param>
        /// <param name="sceneOrgId">组织场景id</param>
        /// <param name="sc"></param>
        /// <returns></returns>
        List<ModelUserExtendFieldConfig> GetModulUserFields(string businessModuleId, string sceneCode, string sceneOrgId, IServerContext sc);

        /// <summary>
        /// 【运行时】根据业务模块id获取用户扩展配置
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="sceneCode"></param>
        /// <param name="sceneOrgId"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        ModelUserExtendConfig GetData(string businessModuleId, string sceneCode, string sceneOrgId, IServerContext sc);
    }
}
