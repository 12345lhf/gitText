using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/24 8:38:30
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】列表字段配置
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 【信息登记模型】列表字段配置
    /// </summary>
    public class ModelListFieldConfig : FieldBase
    {
        /// <summary>
        /// 字段名称
        /// </summary>
        public String FieldName { set; get; }

        /// <summary>
        /// 字段在列表上的宽度
        /// </summary>
        public String Width { set; get; }

        /// <summary>
        /// 是否支持排序
        /// </summary>
        public Boolean IsSupportSort { set; get; }

        /// <summary>
        /// 是否支持查询
        /// </summary>
        public Boolean IsSupportSearch { set; get; }
    }
}
