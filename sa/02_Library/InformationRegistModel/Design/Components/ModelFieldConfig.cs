using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using MongoDB.Bson;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/23 17:41:32
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】表单字段配置
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 表单字段配置
    /// </summary>
    public class ModelFieldConfig : FieldBase
    {

        /// <summary>
        /// 字段名称
        /// </summary>
        public String FieldName { set; get; }

        /// <summary>
        /// 是否是默认字段
        /// </summary>
        public Boolean IsDefaultField { set; get; }

        /// <summary>
        /// 是否是隐藏字段
        /// </summary>
        public Boolean IsHiddenField { set; get; }

        /// <summary>
        /// 字段控件类型
        /// </summary>
        public String ControlType { set; get; }

        /// <summary>
        /// 字段控件普通与不普通
        /// </summary>
        public String ControlNormal { set; get; }

        /// <summary>
        /// 字段控件配置（每个控件配置信息不同，可以进行自定义）
        /// </summary>
        public String ControlConfig { set; get; }
    }
}
