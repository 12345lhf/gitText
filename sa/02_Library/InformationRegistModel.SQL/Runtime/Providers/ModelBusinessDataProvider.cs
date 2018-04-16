using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Interfaces;
using LeadingCloud.Framework;
using MongoDB.Bson;
using LeadingCloud.MISPT.Framework.Common.Components;
using LeadingCloud.MISPT.DataModel.Common;
using LeadingCloud.MISPT.InformationRegistModel.Runtime;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/1 15:31:15
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.SQL.Runtime.Providers
{
    /// <summary>
    /// 
    /// </summary>
    public class ModelBusinessDataProvider : IModelBusinessDataDAL
    {
        /// <summary>
        /// 删除业务模块下的单个业务数据
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="id">实体ID</param>
        /// <param name="sc">上下文信息</param>
        /// <returns></returns>
        public virtual bool Delete(string businessModuleId, string id, IServerContext sc)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="model"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public virtual List<BsonDocument> GetTaskList(SearchModel model,int isbyuser, IServerContext sc)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 获取业务模块下的单个业务数据
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="id">实体ID</param>
        /// <param name="sc">上下文信息</param>
        /// <returns></returns>
        public virtual BsonDocument Load(string businessModuleId, string id, IServerContext sc)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// 新增\插入业务模块下的单个业务数据
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="entity"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public virtual BsonDocument Save(string businessModuleId, BsonDocument entity, IServerContext sc)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 添加成员
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="taskId">任务ID</param>
        /// <param name="member">成员</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public virtual bool AddMember(string businessModuleId, string taskId, BsonDocument member, IServerContext sc)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// 添加成员
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="taskId">任务ID</param>
        /// <param name="members">成员集合</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public virtual bool AddMembers(string businessModuleId, string taskId, BsonArray members, IServerContext sc)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="taskId"></param>
        /// <param name="users"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public virtual bool RemoveMembers(string businessModuleId, string taskId, Dictionary<string, string> users, IServerContext sc)
        {
            throw new NotImplementedException();
        }
        #region 私有方法
        /// <summary>
        /// 获取表名
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <returns></returns>
        protected string GetTableName(string businessModuleId)
        {
            return string.Format("IRM_BIZ_{0}", businessModuleId);
        }
        #endregion
    }
}
