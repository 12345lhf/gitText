using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/23 17:46:47
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】列表配置
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 【信息登记模型】列表配置
    /// </summary>
    public class ModelListConfig
    {
        /// <summary>
        /// 列表上展示的字段
        /// </summary>
        public List<ModelListFieldConfig> ShowFields { set; get; }


#warning 此处暂时使用int类型，为后续如果有列表模板注册管理功能预留
        /// <summary>
        /// 显示模板类型
        /// 0：普通列表
        /// 1：分类列表
        /// </summary>
        public int ShowStyle { get; set; }

        /// <summary>
        /// 是否显示序号列
        /// </summary>
        public bool IsShowSerialNumber { get; set; }

        /// <summary>
        /// 分组字段
        /// </summary>
        public string GroupField { get; set; }

        public ModelListConfig()
        {
            this.ShowFields = new List<ModelListFieldConfig>();
            this.GroupField = "";// new ModelListGroupFieldConfig();
            this.ShowStyle = 0;
        }
    }
}
