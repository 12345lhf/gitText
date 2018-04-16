using LeadingCloud.Framework;
using LeadingCloud.MISPT.DataModel.Common;
using LeadingCloud.MISPT.Framework.Common.Components;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/1 14:50:40
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Interfaces
{
    /// <summary>
    /// 
    /// </summary>
    public interface IModelBusinessDataDAL
    {
        /// <summary>
        /// 新增或修改业务数据
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="entity"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        BsonDocument Save(string businessModuleId, BsonDocument entity, IServerContext sc);

        /// <summary>
        /// 删除业务模块下的单个业务数据
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="id">实体ID</param>
        /// <param name="sc">上下文信息</param>
        /// <returns></returns>
        bool Delete(string businessModuleId, string id, IServerContext sc);

        /// <summary>
        ///获取业务模块下的单个业务数据
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="id">实体ID</param>
        /// <param name="sc">上下文信息</param>
        /// <returns></returns>
        BsonDocument Load(string businessModuleId, string id, IServerContext sc);

        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="model"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        List<BsonDocument> GetTaskList(SearchModel model,int isbyuser, IServerContext sc);

        /// <summary>
        /// 添加成员
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="taskId">任务ID</param>
        /// <param name="member">成员</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        bool AddMember(string businessModuleId, string taskId, BsonDocument member, IServerContext sc);
        /// <summary>
        /// 批量添加成员
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="taskId">任务ID</param>
        /// <param name="members">成员集合</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        bool AddMembers(string businessModuleId, string taskId, BsonArray members, IServerContext sc);
        /// <summary>
        /// 批量删除成员
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="taskId"></param>
        /// <param name="users"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        bool RemoveMembers(string businessModuleId, string taskId, Dictionary<string, string> users, IServerContext sc);
    }
}
