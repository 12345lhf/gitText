using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/8 11:46:29
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Enumerations
{
    /// <summary>
    /// 任务状态
    /// </summary>
    public enum TaskState
    {
        /// <summary>
        /// 未发布
        /// </summary>
        UnPublish=1,
        /// <summary>
        /// 已发布
        /// </summary>
        Publish =2,
        /// <summary>
        /// 已完成
        /// </summary>
        Finish = 3,
        /// <summary>
        /// 废弃
        /// </summary>
        Discard=4,
        /// <summary>
        /// 删除
        /// </summary>
        Remove=5
    }
}
