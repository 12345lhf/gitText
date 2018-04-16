using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/10 16:18:51
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Utils
{
    /// <summary>
    /// 
    /// </summary>
    public class BaseConfigField
    {
        /// <summary>
        /// 表单配置
        /// </summary>
        public static readonly string FormConfig = "FormConfig";

        /// <summary>
        /// 表单属性集合
        /// </summary>
        public static readonly string FormFields = "Fields";

        /// <summary>
        /// 列表配置
        /// </summary>
        public static readonly string ListConfig = "ListConfig";

        /// <summary>
        /// 表单用自定义属性集合
        /// </summary>
        public static readonly string UserExtendFields = "UserExtendFields";

        /// <summary>
        /// 表单属性类型
        /// </summary>
        public static readonly string ControlType = "ControlType";

        /// <summary>
        /// 表单属性名称
        /// </summary>
        public static readonly string FieldName = "FieldName";

        /// <summary>
        /// 表单属性编码
        /// </summary>
        public static readonly string FieldCode = "FieldCode";

        /// <summary>
        /// 属性集合
        /// </summary>
        public static readonly string Propertys = "Propertys";
    }
}
