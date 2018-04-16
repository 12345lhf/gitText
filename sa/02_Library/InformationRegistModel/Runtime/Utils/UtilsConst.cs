using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/13 9:33:04
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Utils
{
    /// <summary>
    /// 
    /// </summary>
    public class UtilsConst
    {

        /// <summary>
        /// 【我的任务】事务编码
        /// </summary>
        public static readonly string MyTaskTransationCode = "IRM_Transaction_Task";

        /// <summary>
        /// 【邀请】事务编码
        /// </summary>
        public static readonly string InvitationTransationCode = "IRM_Transaction_Invitation";


        /// <summary>
        /// 【动态】来源
        /// </summary>
        public static readonly string PostSource = "IRM_Post_Source";

        /// <summary>
        /// 【动态】编码
        /// </summary>
        public static readonly string PostCode = "IRM_Post";

        /// <summary>
        /// 【我的任务编码】已经接受
        /// </summary>
        public static readonly string IRM_Transaction_Invitation_Accept = "IRM_Transaction_Invitation_Accept";
        /// <summary>
        /// 【我的任务编码】已经忽略
        /// </summary>
        public static readonly string IRM_Transaction_Invitation_Ingore = "IRM_Transaction_Invitation_Ingore";
        /// <summary>
        /// 【我的任务编码】已经失效
        /// </summary>
        public static readonly string IRM_Transaction_Invitation_Expired = "IRM_Transaction_Invitation_Expired";

    }
}
