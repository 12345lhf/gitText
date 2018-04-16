using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/4/7 16:39:32
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Enumerations
{
    /// <summary>
    /// 控件类型枚举
    /// </summary>
    public enum ControlType
    {
        /// <summary>
        /// 默认
        /// </summary>
        Default = 0,

        /// <summary>
        /// 资源
        /// </summary>
        Resouce = 1,

        /// <summary>
        /// 人员
        /// </summary>
        Personnel = 2
    }
    /// <summary>
    /// 资源控件保存方式
    /// </summary>
    public enum ResouceControlSaveMode
    {
        /// <summary>
        /// 默认（只保存目录ID）
        /// </summary>
        Default=0,
        /// <summary>
        /// 只保存文件ID
        /// </summary>
        OnlySaveFile=1,
        /// <summary>
        /// 全部保存（目录ID和文件ID）
        /// </summary>
        All=2
    }
}
