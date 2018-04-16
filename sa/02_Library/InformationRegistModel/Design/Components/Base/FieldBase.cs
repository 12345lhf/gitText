using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/6/2 10:40:11
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 字段基类
    /// </summary>
    public class FieldBase
    {

        /// <summary>
        /// 字段编码（GUID主键）
        /// </summary>
        public String FieldCode { set; get; }

        public FieldBase()
        {
            this.FieldCode = "";
        }
    }
}
