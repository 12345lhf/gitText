using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/6/5 10:28:35
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 模块扩展配置
    /// </summary>
    public class ModelExtendConfig
    {
        /// <summary>
        /// 页面扩展工具条配置
        /// </summary>
        public ModelToolBarConfig ExtendToolBarConfig { get; set; }

        /// <summary>
        /// 页面扩展的JS文件配置
        /// </summary>
        public ModelExtendJSConfig ExtendJSConfig { set; get; }

        public ModelExtendConfig()
        {
            this.ExtendJSConfig = new ModelExtendJSConfig();
            this.ExtendToolBarConfig = new ModelToolBarConfig();
        }

    }
}
