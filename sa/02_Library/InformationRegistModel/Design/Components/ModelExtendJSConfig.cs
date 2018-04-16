using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/24 9:22:31
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】扩展JS配置
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 【信息登记模型】扩展JS配置
    /// </summary>
    public class ModelExtendJSConfig
    {
        /// <summary>
        ///  PC端扩展JS文件数组
        /// </summary>
        public ModelExtendJSConfigItem Web { set; get; }

        /// <summary>
        /// 移动端扩展JS文件数组
        /// </summary>
        public ModelExtendJSConfigItem Mobile { set; get; }

        public ModelExtendJSConfig()
        {
            this.Web = new ModelExtendJSConfigItem();
            this.Mobile = new ModelExtendJSConfigItem();
        }
    }
}
