using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/24 8:45:08
 * 机器名称：FZJ-WIN10
 * 描述：【协作任务模块】工具条配置
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 【协作任务模块】工具条配置
    /// </summary>
    public class ModelToolBarItemConfig
    {
        /// <summary>
        /// 工具条按钮编码
        /// </summary>
        public String ButtonCode { set; get; }

        /// <summary>
        /// 工具条按钮名称
        /// </summary>
        public String ButtonName { set; get; }

        /// <summary>
        /// 工具条按钮点击触发事件名称
        /// </summary>
        public String TargetEvent { set; get; }

        /// <summary>
        /// 工具条按钮是否可用
        /// </summary>
        public Boolean IsValid { set; get; }

        /// <summary>
        /// 是否支持PC客户端
        /// </summary>
        public Boolean IsSupportPC { get; set; }

        /// <summary>
        /// 是否支持移动端
        /// </summary>
        public Boolean IsSupportMobile { set; get; }

        /// <summary>
        /// 是否是默认提供的
        /// </summary>
        public Boolean IsDefault { set; get; }
    }
}
