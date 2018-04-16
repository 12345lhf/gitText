using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/6/2 10:23:48
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 属性配置
    /// </summary>
    public class ModelPropertyConfig : FieldBase
    {

        public ModelPropertyConfig()
        {
            this.FieldCode = "";
            this.FieldName = "";
        }
        /// <summary>
        /// 名称
        /// </summary>
        public string FieldName { get; set; }

    }
}
