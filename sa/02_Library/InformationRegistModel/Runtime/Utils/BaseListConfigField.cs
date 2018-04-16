using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/14 10:36:33
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Utils
{
    /// <summary>
    /// 
    /// </summary>
    public class BaseListConfigField
    {
        /// <summary>
        /// 显示字段
        /// </summary>
        public static readonly string ShowFields = "ShowFields";

        /// <summary>
        /// 字段编码
        /// </summary>
        public static readonly string FieldCode = "FieldCode";
        /// <summary>
        /// 字段名称
        /// </summary>
        public static readonly string FieldName = "FieldName";
        /// <summary>
        /// 宽度
        /// </summary>
        public static readonly string Width = "Width";
        /// <summary>
        /// 是否支持排序
        /// </summary>
        public static readonly string IsSupportSort = "IsSupportSort";
        /// <summary>
        /// 是否支持查询
        /// </summary>
        public static readonly string IsSupportSearch = "IsSupportSearch";
    }
}
