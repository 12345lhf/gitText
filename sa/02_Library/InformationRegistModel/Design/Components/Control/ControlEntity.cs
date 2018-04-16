using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.Framework.Database.Components;
using LeadingCloud.Framework.DB.ModelAttribute;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;


/*********************************************************
 * 创建者：lz-WJS
 * 创建日期：2017/4/7 10:44:04
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 【信息登记模型】控件配置数据
    /// </summary>
    [LZDbTable(AppCode = Const.AppCode, TableName = "IRM_Control")]
    public class ControlEntity : DbModel
    {
        /// <summary>
        /// 控件名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 控件编码
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 控件描述
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Web端JS
        /// </summary>
        public string WebJS { get; set; }

        /// <summary>
        /// Web端CSS
        /// </summary>
        public string WebCSS { get; set; }

        /// <summary>
        /// 移动端JS
        /// </summary>
        public string MobileJS { get; set; }

        /// <summary>
        /// 移动端CSS
        /// </summary>
        public string MobileCSS { get; set; }

        /// <summary>
        /// 设计时JS
        /// </summary>
        public string DesignJS { get; set; }

        /// <summary>
        /// 设计时CSS
        /// </summary>
        public string DesignCSS { get; set; }

        /// <summary>
        /// 控件类型
        /// </summary>
        public string ControlType { get; set; }

        /// <summary>
        /// 控件的创建时间
        /// </summary>
        public DateTime? AddTime { set; get; }

        /// <summary>
        /// 控件创建者用户id
        /// </summary>
        public String AddUserId { set; get; }

        /// <summary>
        /// 控件创建者组织机构id
        /// </summary>
        public String OrganizationId { set; get; }

        /// <summary>
        /// 控件扩展配置
        /// </summary>
        public string ExtendConfig { get; set; }

        /// <summary>
        /// 是否默认字段
        /// </summary>
        public bool IsDefault { get; set; }
    }
}
