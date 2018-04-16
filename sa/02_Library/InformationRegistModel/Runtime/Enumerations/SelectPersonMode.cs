using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/10 15:51:31
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Enumerations
{
    /// <summary>
    /// 选人类型
    /// </summary>
    public enum SelectPersonMode
    {
        /// <summary>
        /// 组织机构选人（平台）
        /// </summary>
       Organization=1,
       /// <summary>
       /// 项目团队选人
       /// </summary>
       ProjectTeam=2,
       /// <summary>
       /// 项目内部团队选人
       /// </summary>
       ProjectInnerTeam=3
    }
}
