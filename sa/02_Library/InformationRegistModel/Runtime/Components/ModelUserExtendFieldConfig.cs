using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;


/*********************************************************
 * 创建者：lz-wjs
 * 创建日期：2017/2/23 17:41:32
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】用户扩展表单字段配置
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Components
{
    /// <summary>
    /// 用户扩展表单字段配置
    /// </summary>
    public class ModelUserExtendFieldConfig
    {
        /// <summary>
        /// 字段编码（GUID主键）
        /// </summary>
        public String FieldCode { set; get; }

        /// <summary>
        /// 字段名称
        /// </summary>
        public String FieldName { set; get; }

        ///// <summary>
        ///// 是否是默认字段
        ///// </summary>
        //public Boolean IsDefaultField { set; get; }

        /// <summary>
        /// 字段控件类型
        /// </summary>
        public String ControlType { set; get; }

        /// <summary>
        /// 字段控件配置（每个控件配置信息不同，可以进行自定义）
        /// </summary>
        public string ControlConfig { set; get; }

        ///// <summary>
        ///// 是否在登记单中显示
        ///// </summary>
        //public bool IsShowForm { get; set; }
        ///// <summary>
        ///// 是否在列表中显示
        ///// </summary>
        //public bool IsShowList { get; set; }
        ///// <summary>
        ///// 是否支持查询
        ///// </summary>
        //public bool IsSupportSearch { get; set; }
        ///// <summary>
        ///// 是否支持排序
        ///// </summary>
        //public bool IsSupportSort { get; set; }
        ///// <summary>
        ///// 宽度
        ///// </summary>
        //public string Width { get; set; }
    }
}
