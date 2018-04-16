using LeadingCloud.Framework.DB.ModelAttribute;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;
using LeadingCloud.MISPT.Framework.Database.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

/*********************************************************
 * 创建者：lz-ljp
 * 创建日期：2017年4月6日10:09:48
 * 机器名称：ljpw10
 * 描述：【信息登记模型】运行时配置
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Components
{
    /// <summary>
    /// 【信息登记模型】配置基类 
    /// </summary>
    [LZDbTable(AppCode = Const.AppCode, TableName = "IRM_ModelUserExtend")]
    public class ModelUserExtendConfig : DbModel
    {
        ///// <summary>
        ///// 用户配置表id
        ///// </summary>
        //public String Id { set; get; }

        /// <summary>
        /// 业务模块id
        /// </summary>
        public String BusinessModuleId { set; get; }

        /// <summary>
        /// 场景id
        /// </summary>
        public String SceneCode { set; get; }
        /// <summary>
        /// 组织场景id
        /// </summary>
        public String SceneOrgId { set; get; }
        /// <summary>
        /// 表单配置
        /// </summary>
        public ModelUserExtendFormConfig FormConfig { set; get; }
    }
}
