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
    /// 图表查询类
    /// </summary>
    public class SearchModelForChart
    {
        #region 给图标用的实体类
        /// <summary>
        /// 应用编码
        /// </summary>
        public String AppCode { set; get; }

        /// <summary>
        /// 场景编码
        /// </summary>
        public String SceneCode { set; get; }

        /// <summary>
        /// 业务模块id
        /// </summary>
        public String BusinessModuleId { set; get; }
        /// <summary>
        /// x轴分组字段
        /// </summary>
        public String GroupField { set; get; }
        #endregion
    }
}
