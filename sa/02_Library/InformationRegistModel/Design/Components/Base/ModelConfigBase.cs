using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.Framework.Database.Components;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/6/2 10:38:35
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 【信息登记模型】配置基类
    /// </summary>
    public class ModelConfigBase : DbModel
    {
        /*  继承【NoSqlBaseModel】后自带Id属性
        /// <summary>
        /// 模块id   
        /// </summary>
        public String Id { set; get; }
        */

        /// <summary>
        /// 模块名称
        /// </summary>
        public String Name { set; get; }

        /// <summary>
        /// 模块描述
        /// </summary>
        public String Description { set; get; }

        /// <summary>
        /// 属性配置
        /// </summary>

        public List<ModelPropertyConfig> Propertys { set; get; }

        /// <summary>
        /// 表单配置
        /// </summary>
        public ModelFormConfig FormConfig { set; get; }

        /// <summary>
        /// 列表配置
        /// </summary>
        public ModelListConfig ListConfig { set; get; }

       /// <summary>
       /// 详情页配置
       /// </summary>
        public ModelExtendConfig ExtendConfig { get;set;}


        public ModelConfigBase()
        {
            this.Propertys = new List<ModelPropertyConfig>();
            this.FormConfig = new ModelFormConfig();
            this.ListConfig = new ModelListConfig();
            this.ExtendConfig = new ModelExtendConfig();
        }
    }
}
