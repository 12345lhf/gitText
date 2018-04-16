using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/23 17:28:02
 * 机器名称：FZJ-WIN10
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Enumerations
{
    /// <summary>
    /// 【信息登记模型】模块状态
    /// </summary>
    public enum ModelState
    {
        /// <summary>
        /// 从未发布过
        /// </summary>
        Never = 0,

        /// <summary>
        /// 已保存，未发布
        /// </summary>
        Saved = 1,

        /// <summary>
        /// 已发布
        /// </summary>
        Published = 2
    }
}
