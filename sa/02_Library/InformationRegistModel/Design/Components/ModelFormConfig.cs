using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/23 17:40:05
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】模块表单配置
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 【信息登记模型】模块表单配置
    /// </summary>
    public class ModelFormConfig
    {
        /// <summary>
        /// 表单字段集合
        /// </summary>
        public List<ModelFieldConfig> Fields { set; get; }

        public ModelFormConfig()
        {
            this.Fields = new List<ModelFieldConfig>();
        }
    }
}
