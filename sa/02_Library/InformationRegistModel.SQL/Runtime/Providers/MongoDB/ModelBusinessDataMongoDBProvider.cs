using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.InformationRegistModel.SQL.Utils;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Utils;
using LeadingCloud.MISPT.Framework.Common.Components;
using MongoDB.Driver;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Enumerations;
using LeadingCloud.MISPT.DataModel.Common;
using LeadingCloud.MISPT.DataModel.Common.Enumerations;
using LeadingCloud.MISPT.InformationRegistModel.Runtime;
using System.Text.RegularExpressions;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/1 15:41:27
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.SQL.Runtime.Providers.MongoDB
{
    /// <summary>
    /// 
    /// </summary>
    public class ModelBusinessDataMongoDBProvider : ModelBusinessDataProvider
    {
        /// <summary>
        /// 删除业务模块下的单个业务数据
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="id">实体ID</param>
        /// <param name="sc">上下文信息</param>
        /// <returns></returns>
        public override bool Delete(string businessModuleId, string id, IServerContext sc)
        {
            return MongoDBHelper.DeleteDbModelForNoType(GetTableName(businessModuleId), id);
        }

        /// <summary>
        /// 新增\插入业务模块下的单个业务数据
        /// </summary>
        /// <param name="businessModuleId">业务模块ID</param>
        /// <param name="entity"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public override BsonDocument Save(string businessModuleId, BsonDocument entity, IServerContext sc)
        {
            return MongoDBHelper.SaveDbModelForNoType(entity[BaseField.Id].ToString(), GetTableName(businessModuleId), entity);
        }

        /// <summary>
        /// 获取业务模块下的单个业务数据
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="id">实体ID</param>
        /// <param name="sc">上下文信息</param>
        /// <returns></returns>
        public override BsonDocument Load(string businessModuleId, string id, IServerContext sc)
        {
            return MongoDBHelper.LoadDbModelForNoType(GetTableName(businessModuleId), id);
        }

        /// <summary>
        /// 获取未发布列表
        /// </summary>
        /// <param name="model"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public override List<BsonDocument> GetTaskList(SearchModel model,int isbyuser, IServerContext sc)
        {
            var collection = MongoDBHelper.GetMongoCollectionForNoType(GetTableName(model.BusinessModuleId));

            #region 过滤

            //基础过滤条件
            FilterDefinition<BsonDocument> businessModelId = Builders<BsonDocument>.Filter.Eq(BaseField.BusinessModuleId, model.BusinessModuleId);
            FilterDefinition<BsonDocument> sceneId = Builders<BsonDocument>.Filter.Eq(BaseField.SceneCode, model.SceneCode);

            //和列表相关的过滤（状态和成员身份）
            FilterDefinition<BsonDocument> state = Builders<BsonDocument>.Filter.Empty;
            //此筛选条件是用来补充两种用户类型不同的任务状态（参与人：已发布、已完成，管理员：未发布、已发布、已完成）他们的共同点就是IsValid都是true

            //对成员进行过滤
            FilterDefinition<BsonDocument> userId = Builders<BsonDocument>.Filter.Eq(BaseMemberField.UserId, model.UserId);
            FilterDefinition<BsonDocument> orgId = Builders<BsonDocument>.Filter.Eq(BaseMemberField.OrganizationId, model.OrganizationId);
            List<FilterDefinition<BsonDocument>> all;
            if (isbyuser == 0)
            {
                all = new List<FilterDefinition<BsonDocument>>() {
                businessModelId,
                sceneId,
                state,
                Builders<BsonDocument>.Filter.ElemMatch(BaseField.Members,  userId),
            };
            }
            else {
                 all = new List<FilterDefinition<BsonDocument>>() {
                businessModelId,
                sceneId,
                state,
                //Builders<BsonDocument>.Filter.ElemMatch(BaseField.Members,  userId),
            };
            }
          

            //自定义过滤条件
            if (model.Filter != null)
            {
                foreach (var item in model.Filter)
                {
                    switch (item.FilterType)
                    {
                        case FilterParameterType.Equal:
                            all.Add(Builders<BsonDocument>.Filter.Eq(item.Field, item.Value));
                            break;
                        case FilterParameterType.Like:
                            all.Add(Builders<BsonDocument>.Filter.Regex(item.Field, new BsonRegularExpression(item.Value)));
                            break;
                        default:
                            break;
                    }
                }
            }
            #endregion

            #region 排序
            List<SortDefinition<BsonDocument>> sorts = new List<SortDefinition<BsonDocument>>();
            if (model.Sorts != null)
            {
                foreach (var item in model.Sorts)
                {
                    if (item.IsASC)
                    {
                        sorts.Add(Builders<BsonDocument>.Sort.Ascending(item.Field));
                    }
                    else
                    {
                        sorts.Add(Builders<BsonDocument>.Sort.Descending(item.Field));
                    }
                }
            }
            if (sorts.Count == 0)
            {
                sorts.Add(Builders<BsonDocument>.Sort.Descending(BaseField.CreateTime));
            }
            //排序处理
            SortDefinition<BsonDocument> sort = Builders<BsonDocument>.Sort.Combine(sorts);
            #endregion

            #region 分页
#warning 【待优化】-暂时使用limit和skip进行分页，当skip数据量大的时候，需要做优化

            #endregion

            var list = collection.Find(Builders<BsonDocument>.Filter.And(all)).Sort(sort).Skip(model.StartIndex).Limit(model.Length).ToList();
            return list;
        }

        /// <summary>
        /// 添加成员
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="taskId">任务ID</param>
        /// <param name="member">成员</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public override bool AddMember(string businessModuleId, string taskId, BsonDocument member, IServerContext sc)
        {
            var collection = MongoDBHelper.GetMongoCollectionForNoType(GetTableName(businessModuleId));
            var where = Builders<BsonDocument>.Filter.Eq(BaseField.Id, taskId);
            var set = Builders<BsonDocument>.Update.Push(BaseField.Members, member);
            var result = collection.UpdateOne(where, set);
            return result.ModifiedCount > 0;
        }

        /// <summary>
        /// 批量添加成员
        /// </summary>
        /// <param name="businessModuleId">模块ID</param>
        /// <param name="taskId">任务ID</param>
        /// <param name="members">成员集合</param>
        /// <param name="sc">上下文</param>
        /// <returns></returns>
        public override bool AddMembers(string businessModuleId, string taskId, BsonArray members, IServerContext sc)
        {
            var collection = MongoDBHelper.GetMongoCollectionForNoType(GetTableName(businessModuleId));
            var where = Builders<BsonDocument>.Filter.Eq(BaseField.Id, taskId);
            BsonDocument pushData = new BsonDocument();
            var set = Builders<BsonDocument>.Update.AddToSetEach(BaseField.Members, members);
            var result = collection.UpdateOne(where, set);
            return result.ModifiedCount > 0;
        }


        /// <summary>
        /// 删除成员
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="taskId"></param>
        /// <param name="users"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public override bool RemoveMembers(string businessModuleId, string taskId, Dictionary<string, string> users, IServerContext sc)
        {
            var collection = MongoDBHelper.GetMongoCollectionForNoType(GetTableName(businessModuleId));
            var where = Builders<BsonDocument>.Filter.Eq(BaseField.Id, taskId);
            BsonDocument pushData = new BsonDocument();
            var remove = Builders<BsonDocument>.Update.PullFilter(BaseField.Members, Builders<BsonDocument>.Filter.And(Builders<BsonDocument>.Filter.In(BaseMemberField.UserId, users.Keys), Builders<BsonDocument>.Filter.In(BaseMemberField.OrganizationId, users.Values)));
            var result = collection.UpdateOne(where, remove);
            return result.ModifiedCount > 0;
        }
    }
}
