using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Interfaces;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/2 17:05:58
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Components
{
    /// <summary>
    /// 字段验证实体
    /// </summary>
    public class FieldVerify
    {
        /// <summary>
        /// 字段名
        /// </summary>
        public string FieldName { get; set; }
        /// <summary>
        /// 字段编码
        /// </summary>
        public string FieldCode { get; set; }
        /// <summary>
        /// 控件类型
        /// </summary>
        public string ControlType { get; set; }
        /// <summary>
        /// 值验证
        /// </summary>
        public IControlVerify Verifiable { get; set; }
    }
}
