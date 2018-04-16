using LeadingCloud.MISPT.DataModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

/*********************************************************
 * 创建者：lz-ljp
 * 创建日期：2017年5月3日14:18:06
 * 机器名称：ljpw10
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime
{
    /// <summary>
    /// 继承SearchModel类
    /// </summary>
    public class InheritSearchModel : SearchModel
    {
        /// <summary>
        /// 用户Ids
        /// </summary>
        public String UserIds { set; get; }
        /// <summary>
        /// 查询状态
        /// </summary>
        public int State { set; get; }
        /// <summary>
        /// 业务模块ids
        /// </summary>
        public string BusinessModuleIds { set; get; }
        /// <summary>
        /// 查询的开始日期
        /// </summary>
        public DateTime StartDate { set; get; }
        /// <summary>
        /// 查询的结束日期
        /// </summary>
        public DateTime EndDate { set; get; }
    }
}
