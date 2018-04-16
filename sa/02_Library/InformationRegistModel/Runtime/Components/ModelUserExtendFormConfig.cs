using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Components
{
    /*********************************************************
     * 创建者：lz-ljp
     * 创建日期：2017年4月6日10:06:52
     * 机器名称：ljpw10
     * 描述：【信息登记模型-运行时】用户扩展模块表单配置
     * *******************************************************/
     /// <summary>
     /// 表单项
     /// </summary>
    public class ModelUserExtendFormConfig
    {
        /// <summary>
        /// 【运行时】用户扩展属性 配置项们
        /// </summary>
        public List<ModelUserExtendFieldConfig> Fields { set; get; }
    }
}
