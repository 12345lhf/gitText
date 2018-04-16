using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using LeadingCloud.Framework.NoSql;
using LeadingCloud.Framework.Manager;
using MongoDB.Bson;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Utils;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/27 11:32:13
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】MongoDB助手类
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.SQL.Utils
{
    /// <summary>
    /// 【信息登记模型】MongoDB助手类
    /// </summary>
    public class MongoDBHelper
    {
        #region 基于实体
        /// <summary>
        /// 获取MongoDB的集合对象
        /// </summary>
        /// <typeparam name="DbModel">关联的实体对象信息</typeparam>
        /// <param name="tableName">表名称</param>
        /// <returns>存在返回集合对象；否则返回null</returns>
        public static IMongoCollection<DbModel> GetMongoCollection<DbModel>(String tableName) where DbModel : NoSqlBaseModel
        {
            INoSqlProvider provider = NoSqlManager.Create(Common.Utils.Const.AppCode);
            IMongoCollection<DbModel> collection = provider.GetCollection<DbModel, IMongoCollection<DbModel>>(tableName);
            if (collection == null) throw new SystemException(String.Format("获取信息登记模型MongoDB集合失败。CollectionName：{0}", tableName));
            return collection;
        }

        /// <summary>
        /// 根据主键值自动查询数据
        /// </summary>
        /// <typeparam name="DbModel">关联的实体对象信息</typeparam>
        /// <param name="tableName">表名称</param>
        /// <param name="id">主键值</param>
        /// <returns>存在返回对象；否则返回null</returns>
        public static DbModel LoadDbModel<DbModel>(String tableName, String id) where DbModel : NoSqlBaseModel
        {
            FilterDefinition<DbModel> filter = Builders<DbModel>.Filter.Eq("_id", id);
            IMongoCollection<DbModel> collection = GetMongoCollection<DbModel>(tableName);
            DbModel dbModel = collection.Find(filter).FirstOrDefault();
            return dbModel;
        }

        /// <summary>
        /// 保存数据库实体
        /// </summary>
        /// <typeparam name="DbModel">关联的实体对象信息</typeparam>
        /// <param name="tableName">表名称</param>
        /// <param name="dbModel">要保存的实体</param>
        /// <returns>保存成功返回实体对象；否则返回null</returns>
        public static DbModel SaveDbModel<DbModel>(String tableName, DbModel dbModel) where DbModel : NoSqlBaseModel
        {
            //      获取主键信息；组件主键过滤的查询条件
            String id = Convert.ToString(dbModel.Id);
            FilterDefinition<DbModel> filter = Builders<DbModel>.Filter.Eq("_id", id);
            //      获取集合对象
            IMongoCollection<DbModel> collection = MongoDBHelper.GetMongoCollection<DbModel>(tableName);
            //      判断数据对象是否存在，如果存在则更新，否则插入
            DbModel tmpDbModel = collection.FindOneAndReplace(filter, dbModel);
            if (tmpDbModel == null) collection.InsertOne(dbModel);
            tmpDbModel = collection.Find(filter).FirstOrDefault();
            //      返回保存后的数据
            return tmpDbModel;
        }
        /// <summary>
        /// 根据主键id删除数据库实体
        /// </summary>
        /// <typeparam name="DbModel">关联的实体对象信息</typeparam>
        /// <param name="tableName">表名称</param>
        /// <param name="id">主键值</param>
        /// <returns>删除成功返回true；否则返回false</returns>
        public static Boolean DeleteDbModel<DbModel>(String tableName, String id) where DbModel : NoSqlBaseModel
        {
            FilterDefinition<DbModel> filter = Builders<DbModel>.Filter.Eq("_id", id);
            IMongoCollection<DbModel> collection = MongoDBHelper.GetMongoCollection<DbModel>(tableName);
            return collection.DeleteOne(filter).DeletedCount > 0;
        }

        #endregion

        #region 无实体操作
        /// <summary>
        /// 获取MongoDB的集合对象
        /// </summary>
        /// <param name="tableName">表名称</param>
        /// <returns>存在返回集合对象；否则返回null</returns>
        public static IMongoCollection<BsonDocument> GetMongoCollectionForNoType(String tableName)
        {
            INoSqlProvider provider = NoSqlManager.Create(Common.Utils.Const.AppCode);
            IMongoCollection<BsonDocument> collection = provider.GetCollection<BsonDocument, IMongoCollection<BsonDocument>>(tableName);
            if (collection == null) throw new SystemException(String.Format("获取信息登记模型MongoDB集合失败。CollectionName：{0}", tableName));
            return collection;
        }

        /// <summary>
        /// 根据主键值自动查询数据
        /// </summary>
        /// <param name="tableName">表名称</param>
        /// <param name="id">主键值</param>
        /// <returns>存在返回对象；否则返回null</returns>
        public static BsonDocument LoadDbModelForNoType(String tableName, String id)
        {
            FilterDefinition<BsonDocument> filter = Builders<BsonDocument>.Filter.Eq(BaseField.Id, id);
            IMongoCollection<BsonDocument> collection = GetMongoCollectionForNoType(tableName);
            return collection.Find(filter).FirstOrDefault();
        }

        /// <summary>
        /// 保存数据库实体
        /// </summary>
        /// <param name="id">主键</param>
        /// <param name="tableName">表名称</param>
        /// <param name="dbModel">要保存的实体</param>
        /// <returns>保存成功返回实体对象；否则返回null</returns>
        public static BsonDocument SaveDbModelForNoType(string id, String tableName, BsonDocument dbModel)
        {
            //      获取主键信息；组件主键过滤的查询条件
            FilterDefinition<BsonDocument> filter = Builders<BsonDocument>.Filter.Eq(BaseField.Id, id);
            //      获取集合对象
            IMongoCollection<BsonDocument> collection = MongoDBHelper.GetMongoCollectionForNoType(tableName);
            //      判断数据对象是否存在，如果存在则更新，否则插入
            BsonDocument tmpDbModel = collection.FindOneAndReplace(filter, dbModel);
            if (tmpDbModel == null) collection.InsertOne(dbModel);
            tmpDbModel = collection.Find(filter).FirstOrDefault();
            //      返回保存后的数据
            return tmpDbModel;
        }


        /// <summary>
        /// 根据主键id删除数据库实体
        /// </summary>
        /// <param name="tableName">表名称</param>
        /// <param name="id">主键值</param>
        /// <returns>删除成功返回true；否则返回false</returns>
        public static bool DeleteDbModelForNoType(String tableName, String id)
        {
            FilterDefinition<BsonDocument> filter = Builders<BsonDocument>.Filter.Eq(BaseField.Id, id);
            IMongoCollection<BsonDocument> collection = MongoDBHelper.GetMongoCollectionForNoType(tableName);
            return collection.DeleteOne(filter).DeletedCount > 0;
        }
        #endregion
    }
}
