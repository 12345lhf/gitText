using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/9 16:05:14
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Utils
{
    /// <summary>
    /// 基础字段
    /// </summary>
    public static class BaseField
    {
        /// <summary>
        /// 唯一编码
        /// </summary>
        public static readonly string Id = "_id";
        /// <summary>
        /// 创建日期
        /// </summary>
        public static readonly string CreateTime = "CreateTime";
        ///// <summary>
        ///// 发布日期
        ///// </summary>
        //public static readonly string PublishTime = "PublishTime";
        /// <summary>
        /// 创建用户ID
        /// </summary>
        public static readonly string CreateUserId = "CreateUserId";
        /// <summary>
        /// 创建用户头像ID
        /// </summary>
        public static readonly string CreateUserFaceId = "CreateUserFaceId";
        /// <summary>
        /// 组织机构ID
        /// </summary>
        public static readonly string OrganizationId = "OrganizationId";
        /// <summary>
        /// 系统编码
        /// </summary>
        public static readonly string AppCode = "AppCode";
        /// <summary>
        /// 业务模块ID
        /// </summary>
        public static readonly string BusinessModuleId = "BusinessModuleId";
        /// <summary>
        /// 场景编码（非项目场景下，则为默认场景 BaseScene）
        /// </summary>
        public static readonly string SceneCode = "SceneCode";
        /// <summary>
        /// 资源池ID
        /// </summary>
        public static readonly string ResoucePoolId = "ResoucePoolId";

        ///// <summary>
        ///// 任务状态
        ///// </summary>
        //public static readonly string State = "State";

        /// <summary>
        /// 成员
        /// </summary>
        public static readonly string Members = "Members";

        ///// <summary>
        ///// 收藏者
        ///// </summary>
        //public static readonly string Collectors = "Collectors";

        ///// <summary>
        ///// 是否收藏（只给运行时客户端用，不会存入数据库）
        ///// </summary>
        //public static readonly string IsFavorite = "IsFavorite";

        /// <summary>
        /// 标题（由设计时配置产生）
        /// </summary>
        public static readonly string Title = "Title";

    }
}
