using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/10 15:05:22
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Utils
{
    /// <summary>
    /// 成员字段
    /// </summary>
    public static class BaseMemberField
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        public static readonly  string UserId="UserId";
        /// <summary>
        /// 用户头像ID
        /// </summary>
        public static readonly string UserFaceId = "UserFaceId";
        /// <summary>
        /// 用户组织机构ID
        /// </summary>
        public static readonly string OrganizationId = "OrganizationId";
        /// <summary>
        /// 成员类型
        /// </summary>
        public static readonly string MemberType = "MemberType";
        /// <summary>
        /// 是否有效
        /// </summary>
        public static readonly string IsVaild = "IsValid";
        /// <summary>
        /// 加入时间
        /// </summary>
        public static readonly string JoinTime = "JoinTime";
    }
}
